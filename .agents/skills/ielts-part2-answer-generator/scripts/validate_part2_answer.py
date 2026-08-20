#!/usr/bin/env python3
"""Validate the deterministic contract for a generated IELTS Part 2 answer."""

from __future__ import annotations

import re
import sys
from pathlib import Path


WORD_RE = re.compile(r"[A-Za-z]+(?:[’'-][A-Za-z]+)*")
ABILITY_NAMES = {
    "Communication Skills",
    "Problem-solving Skills",
    "Learning Ability",
    "Adaptability",
    "Leadership & Collaboration",
    "Creativity & Innovation",
}
REQUIRED_HEADINGS = (
    "## 1. Core Ability Mapping",
    "## 2. Story Bank",
    "## 3. Band 7 Answer (1:40–2:00)",
    "## 4. Useful Collocations",
)
MARKERS = (
    "<!-- NARRATIVE_START -->",
    "<!-- NARRATIVE_END -->",
    "<!-- REFLECTION_START -->",
    "<!-- REFLECTION_END -->",
)


def words(text: str) -> list[str]:
    return WORD_RE.findall(text)


def between(text: str, start: str, end: str) -> str:
    return text.split(start, 1)[1].split(end, 1)[0]


def validate(path: Path) -> tuple[list[str], dict[str, float | int]]:
    errors: list[str] = []
    text = path.read_text(encoding="utf-8")

    titles = re.findall(r"^# (.+?)\s*$", text, re.MULTILINE)
    if len(titles) != 1:
        errors.append(f"expected one H1 cue-card title, found {len(titles)}")
    elif path.stem != titles[0].rstrip(".?!").replace("/", " or "):
        errors.append("filename does not match the sanitized H1 cue-card title")

    bank_lines = re.findall(
        r"^> Bank:\s*(B[1-8])\s*\|\s*Modules:\s*(.+?)\s*$", text, re.MULTILINE
    )
    module_count = 0
    if len(bank_lines) != 1:
        errors.append(f"expected one valid Bank/modules line, found {len(bank_lines)}")
    else:
        modules = [module.strip() for module in bank_lines[0][1].split("/")]
        module_count = len([module for module in modules if module])
        if module_count not in (2, 3):
            errors.append(f"expected 2–3 modules, found {module_count}")

    positions = []
    for heading in REQUIRED_HEADINGS:
        count = text.count(heading)
        if count != 1:
            errors.append(f"expected exactly one heading {heading!r}, found {count}")
        positions.append(text.find(heading))
    if all(position >= 0 for position in positions) and positions != sorted(positions):
        errors.append("required headings are out of order")

    marker_positions = []
    for marker in MARKERS:
        count = text.count(marker)
        if count != 1:
            errors.append(f"expected exactly one marker {marker!r}, found {count}")
        marker_positions.append(text.find(marker))
    if all(position >= 0 for position in marker_positions) and marker_positions != sorted(marker_positions):
        errors.append("answer markers are out of order")

    narrative = ""
    reflection = ""
    if not any(position < 0 for position in marker_positions):
        narrative = between(text, MARKERS[0], MARKERS[1])
        reflection = between(text, MARKERS[2], MARKERS[3])

    narrative_count = len(words(narrative))
    reflection_count = len(words(reflection))
    total = narrative_count + reflection_count
    narrative_ratio = narrative_count / total if total else 0.0
    reflection_ratio = reflection_count / total if total else 0.0

    if not 180 <= total <= 210:
        errors.append(f"answer has {total} words; expected 180–210")
    if total and not 0.27 <= narrative_ratio <= 0.33:
        errors.append(
            f"narrative is {narrative_ratio:.1%}; expected 27–33%"
        )
    if total and not 0.67 <= reflection_ratio <= 0.73:
        errors.append(
            f"reflection is {reflection_ratio:.1%}; expected 67–73%"
        )

    ability_section = ""
    if REQUIRED_HEADINGS[0] in text and REQUIRED_HEADINGS[1] in text:
        ability_section = between(text, REQUIRED_HEADINGS[0], REQUIRED_HEADINGS[1])
    primary = re.findall(r"^- Primary Ability:\s*(.+?)\s*$", ability_section, re.MULTILINE)
    secondary = re.findall(r"^- Secondary Ability:\s*(.+?)\s*$", ability_section, re.MULTILINE)
    if len(primary) != 1:
        errors.append(f"expected one Primary Ability, found {len(primary)}")
    selected = primary + secondary
    if len(secondary) > 1 or not 1 <= len(selected) <= 2:
        errors.append(f"expected 1–2 abilities, found {len(selected)}")
    for ability in selected:
        if ability not in ABILITY_NAMES:
            errors.append(f"unknown ability name: {ability!r}")
    if len(selected) != len(set(selected)):
        errors.append("Primary and Secondary Ability must be different")
    reasons = re.findall(r"^- Reason:\s*(\S.+?)\s*$", ability_section, re.MULTILINE)
    if len(reasons) != len(selected):
        errors.append(
            f"expected one non-empty reason per ability; found {len(reasons)} "
            f"for {len(selected)} abilities"
        )

    story_section = ""
    if REQUIRED_HEADINGS[1] in text and REQUIRED_HEADINGS[2] in text:
        story_section = between(text, REQUIRED_HEADINGS[1], REQUIRED_HEADINGS[2])
    for field in ("Who/What", "Background", "Main event", "Ability shown", "Reflection"):
        if not re.search(rf"^- {re.escape(field)}:\s*\S", story_section, re.MULTILINE):
            errors.append(f"Story Bank field {field!r} is missing or empty")

    collocation_section = ""
    if REQUIRED_HEADINGS[3] in text:
        collocation_section = text.split(REQUIRED_HEADINGS[3], 1)[1]
    collocations = [
        item.strip()
        for item in re.findall(r"^-\s+(.+?)\s*$", collocation_section, re.MULTILINE)
        if item.strip()
    ]
    if not 8 <= len(collocations) <= 10:
        errors.append(f"found {len(collocations)} collocations; expected 8–10")
    if len(collocations) != len(set(collocations)):
        errors.append("collocations must be unique")

    if re.search(r"^#{1,4}\s+(?:P3|Part 3)\b", text, re.IGNORECASE | re.MULTILINE):
        errors.append("Part 3 content is not allowed")

    stats: dict[str, float | int] = {
        "total_words": total,
        "narrative_words": narrative_count,
        "narrative_ratio": narrative_ratio,
        "reflection_words": reflection_count,
        "reflection_ratio": reflection_ratio,
        "estimated_seconds_at_105_wpm": round(total / 105 * 60) if total else 0,
        "abilities": len(selected),
        "modules": module_count,
        "collocations": len(collocations),
    }
    return errors, stats


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: validate_part2_answer.py <answer.md> [<answer.md> ...]", file=sys.stderr)
        return 2

    failed = False
    for raw_path in sys.argv[1:]:
        path = Path(raw_path)
        if not path.is_file():
            print(f"FAIL {path}: file not found")
            failed = True
            continue
        errors, stats = validate(path)
        status = "FAIL" if errors else "PASS"
        print(
            f"{status} {path}: total={stats['total_words']}, "
            f"narrative={stats['narrative_words']} ({stats['narrative_ratio']:.1%}), "
            f"reflection={stats['reflection_words']} ({stats['reflection_ratio']:.1%}), "
            f"duration@105WPM={stats['estimated_seconds_at_105_wpm']}s, "
            f"modules={stats['modules']}, abilities={stats['abilities']}, "
            f"collocations={stats['collocations']}"
        )
        for error in errors:
            print(f"  - {error}")
        failed = failed or bool(errors)
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
