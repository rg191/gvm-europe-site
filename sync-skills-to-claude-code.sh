#!/usr/bin/env bash
#
# sync-skills-to-claude-code.sh
#
# Niviloop workspace skilljeit symlinkkel elérhetővé teszi Claude Code számára.
# Egy helyen szerkeszted (~/Niviloop_Cowork/skills/), mindkét rendszerben él.
#
# Használat:
#   ./sync-skills-to-claude-code.sh           # symlinkek létrehozása
#   ./sync-skills-to-claude-code.sh --dry-run # csak mutatja mit tenne
#   ./sync-skills-to-claude-code.sh --clean   # csak töröl, nem hoz létre
#   ./sync-skills-to-claude-code.sh --list    # listázza a jelenlegi állapotot

set -euo pipefail

# ---- Konfiguráció ----------------------------------------------------------

SOURCE_DIR="${HOME}/Niviloop_Cowork/skills"
TARGET_DIR="${HOME}/.claude/skills"

# Színek (csak ha terminál)
if [[ -t 1 ]]; then
  C_RESET=$'\033[0m'; C_BOLD=$'\033[1m'
  C_GREEN=$'\033[32m'; C_YELLOW=$'\033[33m'; C_RED=$'\033[31m'; C_BLUE=$'\033[34m'
else
  C_RESET=''; C_BOLD=''; C_GREEN=''; C_YELLOW=''; C_RED=''; C_BLUE=''
fi

log_info()  { echo "${C_BLUE}ℹ${C_RESET}  $*"; }
log_ok()    { echo "${C_GREEN}✓${C_RESET}  $*"; }
log_warn()  { echo "${C_YELLOW}⚠${C_RESET}  $*"; }
log_err()   { echo "${C_RED}✗${C_RESET}  $*" >&2; }

# ---- Argumentumok ----------------------------------------------------------

DRY_RUN=0
CLEAN_ONLY=0
LIST_ONLY=0

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    --clean)   CLEAN_ONLY=1 ;;
    --list)    LIST_ONLY=1 ;;
    -h|--help)
      sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *) log_err "Ismeretlen argumentum: $arg"; exit 2 ;;
  esac
done

# ---- Előfeltételek ---------------------------------------------------------

if [[ ! -d "$SOURCE_DIR" ]]; then
  log_err "Forrás mappa nem létezik: $SOURCE_DIR"
  log_info "Hozd létre: mkdir -p \"$SOURCE_DIR\""
  exit 1
fi

mkdir -p "$TARGET_DIR"

# ---- Listázás --------------------------------------------------------------

if [[ $LIST_ONLY -eq 1 ]]; then
  log_info "${C_BOLD}Claude Code skillek (${TARGET_DIR}):${C_RESET}"
  if [[ -z "$(ls -A "$TARGET_DIR" 2>/dev/null)" ]]; then
    echo "  (üres)"
  else
    for entry in "$TARGET_DIR"/*; do
      [[ -e "$entry" ]] || continue
      name=$(basename "$entry")
      if [[ -L "$entry" ]]; then
        target=$(readlink "$entry")
        if [[ -e "$entry" ]]; then
          echo "  ${C_GREEN}→${C_RESET} ${name} ${C_BLUE}(symlink → ${target})${C_RESET}"
        else
          echo "  ${C_RED}✗${C_RESET} ${name} ${C_RED}(törött symlink → ${target})${C_RESET}"
        fi
      else
        echo "  ${C_YELLOW}●${C_RESET} ${name} ${C_YELLOW}(valódi mappa, nem symlink)${C_RESET}"
      fi
    done
  fi
  exit 0
fi

# ---- Clean (törött symlinkek + clean-only mód) -----------------------------

cleanup_broken_symlinks() {
  local removed=0
  for entry in "$TARGET_DIR"/*; do
    [[ -L "$entry" ]] || continue
    if [[ ! -e "$entry" ]]; then
      local name; name=$(basename "$entry")
      if [[ $DRY_RUN -eq 1 ]]; then
        log_warn "[DRY-RUN] Törött symlink: $name"
      else
        rm "$entry"
        log_warn "Törött symlink törölve: $name"
      fi
      removed=$((removed + 1))
    fi
  done
  if [[ $removed -eq 0 ]]; then
    log_info "Nincsenek törött symlinkek."
  fi
}

if [[ $CLEAN_ONLY -eq 1 ]]; then
  log_info "Clean mód: csak takarítás."
  cleanup_broken_symlinks
  # Plusz: töröljük a régi Niviloop symlinkeket is
  for entry in "$TARGET_DIR"/*; do
    [[ -L "$entry" ]] || continue
    target=$(readlink "$entry")
    if [[ "$target" == "$SOURCE_DIR/"* ]]; then
      name=$(basename "$entry")
      if [[ $DRY_RUN -eq 1 ]]; then
        log_warn "[DRY-RUN] Eltávolítaná: $name → $target"
      else
        rm "$entry"
        log_ok "Eltávolítva: $name"
      fi
    fi
  done
  exit 0
fi

# ---- Szinkron --------------------------------------------------------------

log_info "${C_BOLD}Forrás:${C_RESET} $SOURCE_DIR"
log_info "${C_BOLD}Cél:${C_RESET}    $TARGET_DIR"
[[ $DRY_RUN -eq 1 ]] && log_warn "DRY-RUN mód — semmi nem változik."
echo

# Első: törött symlinkek takarítása
cleanup_broken_symlinks
echo

linked=0
skipped=0
conflict=0

for skill_dir in "$SOURCE_DIR"/*/; do
  [[ -d "$skill_dir" ]] || continue
  skill_name=$(basename "$skill_dir")
  target="$TARGET_DIR/$skill_name"

  # SKILL.md kötelező a forrásban
  if [[ ! -f "$skill_dir/SKILL.md" ]]; then
    log_warn "Kihagyva (nincs SKILL.md): $skill_name"
    skipped=$((skipped + 1))
    continue
  fi

  if [[ -L "$target" ]]; then
    current=$(readlink "$target")
    expected="${skill_dir%/}"
    if [[ "$current" == "$expected" ]]; then
      log_info "Már létezik: $skill_name"
      skipped=$((skipped + 1))
      continue
    else
      log_warn "Symlink frissítése: $skill_name (volt: $current)"
      if [[ $DRY_RUN -eq 0 ]]; then
        rm "$target"
        ln -s "$expected" "$target"
      fi
      linked=$((linked + 1))
      continue
    fi
  fi

  if [[ -e "$target" ]]; then
    log_err "Konfliktus: $target már létezik valódi mappaként/fájlként."
    log_info "  Manuálisan oldd fel: backup vagy törlés után futtasd újra."
    conflict=$((conflict + 1))
    continue
  fi

  if [[ $DRY_RUN -eq 1 ]]; then
    log_ok "[DRY-RUN] Symlink: $skill_name → ${skill_dir%/}"
  else
    ln -s "${skill_dir%/}" "$target"
    log_ok "Symlink: $skill_name"
  fi
  linked=$((linked + 1))
done

# ---- Összefoglaló ----------------------------------------------------------

echo
log_info "${C_BOLD}Összefoglaló:${C_RESET}"
echo "  Új/frissített symlink: $linked"
echo "  Kihagyva:              $skipped"
[[ $conflict -gt 0 ]] && echo "  ${C_RED}Konfliktus:            $conflict${C_RESET}"

if [[ $conflict -gt 0 ]]; then
  exit 1
fi
