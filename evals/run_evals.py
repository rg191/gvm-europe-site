#!/usr/bin/env python3
"""
GVM Europe AI Ágens — Eval futtató (függőség nélküli scaffold).

Cél: a moduláris ágens-architektúra sikerességi rátájának MÉRHETŐ követése.
A rubrikás pontozás emberi (vagy bíró-modell) értékelésen alapul: az ágens kimenetét
egy esetnél a rubrikapontok teljesülése szerint pontozzuk (0..1). Sikeres: >= 0.8.

Használat:
  python3 evals/run_evals.py --validate            # csak a case-fájl szerkezetét ellenőrzi
  python3 evals/run_evals.py --template > score.csv # üres pontozó-sablon generálása
  python3 evals/run_evals.py --score score.csv      # kitöltött sablonból sikerességi ráta

A score.csv formátuma soronként:  case_id,passed_rubric_points,total_rubric_points
"""
import argparse
import csv
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CASES_PATH = os.path.join(HERE, "cases.json")
PASS_THRESHOLD = 0.8


def load_cases():
    with open(CASES_PATH, encoding="utf-8") as f:
        return json.load(f)


def validate(data):
    cases = data.get("cases", [])
    required = {"id", "domain", "expected_route", "input", "rubric"}
    ids = set()
    errors = []
    for i, c in enumerate(cases):
        missing = required - set(c)
        if missing:
            errors.append(f"#{i}: hiányzó mezők: {sorted(missing)}")
        if c.get("id") in ids:
            errors.append(f"#{i}: duplikált id: {c.get('id')}")
        ids.add(c.get("id"))
        if not c.get("rubric"):
            errors.append(f"{c.get('id')}: üres rubrika")
    if errors:
        print("HIBÁS case-fájl:")
        for e in errors:
            print("  -", e)
        return 1
    print(f"OK — {len(cases)} eset, mind érvényes. Domainek: "
          + ", ".join(sorted({c['domain'] for c in cases})))
    return 0


def template(data):
    w = csv.writer(sys.stdout)
    w.writerow(["case_id", "passed_rubric_points", "total_rubric_points"])
    for c in data["cases"]:
        w.writerow([c["id"], "", len(c["rubric"])])


def score(data, path):
    by_id = {c["id"]: c for c in data["cases"]}
    rows, passed = [], 0
    with open(path, encoding="utf-8") as f:
        for r in csv.DictReader(f):
            cid = r["case_id"]
            if not r["passed_rubric_points"]:
                continue
            p, t = int(r["passed_rubric_points"]), int(r["total_rubric_points"])
            s = p / t if t else 0.0
            ok = s >= PASS_THRESHOLD
            passed += ok
            rows.append((cid, by_id.get(cid, {}).get("domain", "?"), s, ok))
    if not rows:
        print("Nincs kitöltött sor a pontozó-fájlban.")
        return 1
    print(f"{'eset':<18}{'domain':<16}{'score':<8}sikeres")
    for cid, dom, s, ok in rows:
        print(f"{cid:<18}{dom:<16}{s:<8.2f}{'✓' if ok else '✗'}")
    rate = passed / len(rows)
    print(f"\nSikerességi ráta: {passed}/{len(rows)} = {rate:.0%}  "
          f"(küszöb esetenként {PASS_THRESHOLD:.0%})")
    return 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--validate", action="store_true")
    ap.add_argument("--template", action="store_true")
    ap.add_argument("--score", metavar="CSV")
    args = ap.parse_args()
    data = load_cases()
    if args.validate:
        return validate(data)
    if args.template:
        template(data)
        return 0
    if args.score:
        return score(data, args.score)
    ap.print_help()
    return 0


if __name__ == "__main__":
    sys.exit(main())
