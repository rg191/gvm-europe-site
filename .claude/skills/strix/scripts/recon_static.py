#!/usr/bin/env python3
"""Strix static recon — gyakori, könnyen automatizálható biztonsági problémák
felderítése statikus HTML/CSS oldalakban és a Netlify konfigurációban.

A kimenet KIINDULÓPONT, nem végeredmény: a talált tételeket a SKILL.md
2)-3) fázisán (igazold a valós hatást) kell átvinni, mielőtt jelentenéd.

Használat:
    python3 recon_static.py <mappa> [--netlify netlify.toml] [--json]

Csak a Python standard könyvtárat használja, nincs külső függőség.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys

# --- Mintázatok --------------------------------------------------------------

EXTERNAL_SRC_RE = re.compile(
    r"""<(?:script|link)\b[^>]*?\b(?:src|href)\s*=\s*["'](https?:)?//([^"'/]+)[^"']*["'][^>]*>""",
    re.IGNORECASE,
)
INTEGRITY_RE = re.compile(r"\bintegrity\s*=", re.IGNORECASE)
TARGET_BLANK_RE = re.compile(r"""<a\b[^>]*\btarget\s*=\s*["']_blank["'][^>]*>""", re.IGNORECASE)
REL_NOOPENER_RE = re.compile(r"""\brel\s*=\s*["'][^"']*noopener[^"']*["']""", re.IGNORECASE)
INLINE_HANDLER_RE = re.compile(r"""\son[a-z]+\s*=\s*["']""", re.IGNORECASE)
HTTP_URL_RE = re.compile(r"""["'(]http://[^"'()\s>]+""", re.IGNORECASE)
JS_URL_RE = re.compile(r"""\b(?:href|src)\s*=\s*["']\s*javascript:""", re.IGNORECASE)
FORM_ACTION_RE = re.compile(r"""<form\b[^>]*\baction\s*=\s*["']([^"']*)["'][^>]*>""", re.IGNORECASE)
DANGEROUS_DOM_RE = re.compile(r"\b(innerHTML|document\.write|insertAdjacentHTML)\b")

# Beégetett titkok — óvatos, hogy kevés legyen a hamis riasztás.
SECRET_RES = [
    ("Általános API-kulcs", re.compile(r"""(?i)\b(api[_-]?key|apikey|secret|token|passwd|password)\b\s*[:=]\s*["'][^"']{8,}["']""")),
    ("AWS access key", re.compile(r"\bAKIA[0-9A-Z]{16}\b")),
    ("Google API key", re.compile(r"\bAIza[0-9A-Za-z_\-]{35}\b")),
    ("Privát kulcs blokk", re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----")),
    ("Slack token", re.compile(r"\bxox[baprs]-[0-9A-Za-z\-]{10,}")),
    ("JWT", re.compile(r"\beyJ[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}\b")),
]

# Recon során kitett érzékeny fájlnevek/könyvtárak.
SENSITIVE_NAMES = {
    ".env", ".git", ".gitignore", ".DS_Store", ".htpasswd", ".htaccess",
    "id_rsa", "id_dsa", "credentials", "config.php", "wp-config.php",
    "docker-compose.yml", "Dockerfile", ".npmrc", ".aws",
}
SENSITIVE_SUFFIXES = (".bak", ".old", ".orig", ".swp", ".sql", ".log", "~", ".pem", ".key")

# Elvárt biztonsági fejlécek (kisbetűsen).
EXPECTED_HEADERS = {
    "content-security-policy": ("Medium", "XSS elleni fő védelem hiányzik"),
    "strict-transport-security": ("Low", "HSTS hiányzik (HTTPS-kényszerítés)"),
    "x-content-type-options": ("Low", "MIME-sniffing nincs tiltva (nosniff)"),
    "x-frame-options": ("Low", "Clickjacking védelem hiányzik (vagy CSP frame-ancestors)"),
    "referrer-policy": ("Info", "Referrer-Policy nincs beállítva"),
    "permissions-policy": ("Info", "Permissions-Policy nincs beállítva"),
}


def add(findings, sev, cat, msg, loc):
    findings.append({"severity": sev, "category": cat, "message": msg, "location": loc})


def scan_html(path, findings):
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as fh:
            text = fh.read()
    except OSError as exc:
        add(findings, "Info", "olvasási hiba", str(exc), path)
        return

    for m in EXTERNAL_SRC_RE.finditer(text):
        tag = m.group(0)
        host = m.group(2)
        if not INTEGRITY_RE.search(tag):
            add(findings, "Medium", "SRI hiányzik",
                f"Külső erőforrás integrity nélkül ({host}) — feltört CDN kódot futtathat",
                f"{path}: {tag[:120]}")

    for m in TARGET_BLANK_RE.finditer(text):
        if not REL_NOOPENER_RE.search(m.group(0)):
            add(findings, "Low", "rel=noopener hiányzik",
                "target=\"_blank\" rel=\"noopener\" nélkül — reverse tabnabbing",
                f"{path}: {m.group(0)[:120]}")

    for m in HTTP_URL_RE.finditer(text):
        add(findings, "Low", "kevert tartalom",
            "http:// hivatkozás HTTPS oldalon (mixed content)",
            f"{path}: {m.group(0)[:120]}")

    if INLINE_HANDLER_RE.search(text):
        n = len(INLINE_HANDLER_RE.findall(text))
        add(findings, "Info", "inline eseménykezelő",
            f"{n} db inline on* kezelő — nehezíti a szigorú CSP-t",
            path)

    for m in JS_URL_RE.finditer(text):
        add(findings, "Low", "javascript: URL",
            "javascript: URL — CSP-vel nehezen összeegyeztethető, XSS-vektor",
            f"{path}: {m.group(0)[:120]}")

    for m in DANGEROUS_DOM_RE.finditer(text):
        add(findings, "Info", "kockázatos DOM API",
            f"{m.group(1)} használat — ellenőrizd, nem kerül-e bele felhasználói/URL-adat (DOM XSS)",
            path)

    for m in FORM_ACTION_RE.finditer(text):
        action = m.group(1).strip()
        if action.startswith("http://"):
            add(findings, "Medium", "űrlap HTTP-re",
                "Az űrlap adatokat titkosítatlan http:// címre küld",
                f"{path}: action={action}")
        elif action.startswith("//") or action.startswith("https://"):
            add(findings, "Info", "külső űrlap-célpont",
                f"Az űrlap külső címre küld ({action}) — ellenőrizd a bizalmat/CSRF-et",
                f"{path}: action={action}")

    for label, rx in SECRET_RES:
        for m in rx.finditer(text):
            add(findings, "High", "lehetséges beégetett titok",
                f"{label} minta a forrásban — a kliensre kerülő adat publikus",
                f"{path}: …{m.group(0)[:60]}…")


def scan_tree(root, findings):
    exposed = []
    for dirpath, dirnames, filenames in os.walk(root):
        # kitett érzékeny könyvtárak
        for d in list(dirnames):
            if d in SENSITIVE_NAMES:
                exposed.append(os.path.join(dirpath, d))
        for name in filenames:
            full = os.path.join(dirpath, name)
            if name in SENSITIVE_NAMES or name.endswith(SENSITIVE_SUFFIXES):
                exposed.append(full)
            if name.lower().endswith((".html", ".htm")):
                scan_html(full, findings)
    for path in exposed:
        add(findings, "Medium", "kitett érzékeny fájl",
            "A publish mappában érzékeny fájl/könyvtár lehet elérhető",
            path)


def scan_netlify(netlify_path, findings):
    try:
        with open(netlify_path, "r", encoding="utf-8", errors="replace") as fh:
            text = fh.read().lower()
    except OSError as exc:
        add(findings, "Info", "netlify config", f"Nem olvasható: {exc}", netlify_path)
        return
    has_headers_block = "[[headers]]" in text
    if not has_headers_block:
        add(findings, "Medium", "nincs fejléc-konfiguráció",
            "A Netlify configban nincs [[headers]] blokk — hiányoznak a biztonsági fejlécek",
            netlify_path)
        return
    for header, (sev, desc) in EXPECTED_HEADERS.items():
        if header not in text:
            add(findings, sev, "hiányzó biztonsági fejléc", desc, netlify_path)


SEV_ORDER = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3, "Info": 4}


def main(argv=None):
    ap = argparse.ArgumentParser(description="Strix static recon")
    ap.add_argument("target", help="HTML mappa (pl. sites/ vagy sites/glogiai.hu/public)")
    ap.add_argument("--netlify", help="netlify.toml útvonala a fejléc-ellenőrzéshez")
    ap.add_argument("--json", action="store_true", help="JSON kimenet")
    args = ap.parse_args(argv)

    if not os.path.exists(args.target):
        print(f"HIBA: nincs ilyen útvonal: {args.target}", file=sys.stderr)
        return 2

    findings = []
    scan_tree(args.target, findings)
    if args.netlify:
        scan_netlify(args.netlify, findings)

    findings.sort(key=lambda f: (SEV_ORDER.get(f["severity"], 9), f["category"]))

    if args.json:
        print(json.dumps({"target": args.target, "findings": findings},
                         ensure_ascii=False, indent=2))
        return 0

    if not findings:
        print("Nem találtam automatizáltan felderíthető problémát.")
        print("Ez NEM jelenti, hogy az oldal biztonságos — folytasd a kézi checklisttel.")
        return 0

    counts = {}
    for f in findings:
        counts[f["severity"]] = counts.get(f["severity"], 0) + 1
    summary = "  ".join(f"{s}: {counts[s]}" for s in
                        sorted(counts, key=lambda x: SEV_ORDER.get(x, 9)))
    print(f"Strix static recon — {args.target}")
    print(f"Összesen {len(findings)} tétel   [{summary}]")
    print("(Kiindulópont — igazold a valós hatást a jelentés előtt.)\n")
    for f in findings:
        print(f"[{f['severity']:<8}] {f['category']}")
        print(f"    {f['message']}")
        print(f"    → {f['location']}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
