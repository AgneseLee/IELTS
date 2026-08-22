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
CUE_HEADING = "## Cue Card"
ABILITY_HEADING = "## 1. Core Ability Mapping"
STORY_HEADING = "## 2. Story Bank"
ANSWER_HEADING = "## 3. Band 7 Answer (1:40–2:00)"
COLLOCATION_HEADING = "## 4. Useful Collocations"
REQUIRED_HEADINGS = (
    CUE_HEADING,
    ABILITY_HEADING,
    STORY_HEADING,
    ANSWER_HEADING,
    COLLOCATION_HEADING,
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


def source_cue(title: str) -> tuple[str, list[str]] | None:
    repo_root = Path(__file__).resolve().parents[4]
    topic_bank = repo_root / "speaking/answers/part2/topic-bank.md"
    if not topic_bank.is_file():
        return None
    source = topic_bank.read_text(encoding="utf-8")
    pattern = re.compile(
        rf"^\*\*{re.escape(title)}\*\*\s*$\n\s*"
        rf"^> \*\*You should say:\*\*\s*$\n"
        rf"(?P<bullets>(?:^> - .+\s*$\n?)+)",
        re.MULTILINE,
    )
    match = pattern.search(source)
    if not match:
        return None
    bullets = re.findall(r"^> - (.+?)\s*$", match.group("bullets"), re.MULTILINE)
    return title, bullets


def source_has_heart(title: str) -> bool:
    repo_root = Path(__file__).resolve().parents[4]
    topic_bank = repo_root / "speaking/answers/part2/topic-bank.md"
    if not topic_bank.is_file():
        return False
    source = topic_bank.read_text(encoding="utf-8")
    return bool(
        re.search(
            rf"^### .+❤️\s*$\n\s*^#### Part 2\s*$\n\s*^\*\*{re.escape(title)}\*\*\s*$",
            source,
            re.MULTILINE,
        )
    )


def source_bank_collocations(bank: str) -> list[str]:
    repo_root = Path(__file__).resolve().parents[4]
    plan = repo_root / "speaking/plans/20-day-band7.md"
    if not plan.is_file():
        return []
    source = plan.read_text(encoding="utf-8")
    match = re.search(
        rf"^\|\s*{re.escape(bank)}\s*\|[^|]*\|(?P<phrases>[^|]+)\|",
        source,
        re.MULTILINE,
    )
    return re.findall(r"`([^`]+)`", match.group("phrases")) if match else []


def source_collocation_corpus() -> str:
    repo_root = Path(__file__).resolve().parents[4]
    paths = (
        repo_root / "speaking/plans/20-day-band7.md",
        repo_root / "speaking/answers/part2/6skills.md",
        repo_root / "speaking/answers/part2-people.md",
        repo_root / "speaking/answers/part2-events.md",
        repo_root / "speaking/answers/part2-places.md",
        repo_root / "speaking/answers/part2-things.md",
    )
    return "\n".join(
        path.read_text(encoding="utf-8").lower() for path in paths if path.is_file()
    )


def validate(path: Path) -> tuple[list[str], dict[str, float | int]]:
    errors: list[str] = []
    text = path.read_text(encoding="utf-8")

    h1_titles = re.findall(r"^# (.+?)\s*$", text, re.MULTILINE)
    if h1_titles:
        errors.append(
            "H1 titles are not allowed; Obsidian displays the filename as the title"
        )

    bank_lines = re.findall(
        r"^> Bank:\s*(B[1-8])\s*\|\s*Modules:\s*(.+?)\s*$", text, re.MULTILINE
    )
    selected_bank = ""
    module_count = 0
    if len(bank_lines) != 1:
        errors.append(f"expected one valid Bank/modules line, found {len(bank_lines)}")
    else:
        selected_bank = bank_lines[0][0]
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

    cue_section = ""
    if CUE_HEADING in text and ABILITY_HEADING in text:
        cue_section = between(text, CUE_HEADING, ABILITY_HEADING)
    displayed_title_matches = re.findall(
        r"^\*\*(❤️ )?(.+?)\*\*\s*$", cue_section, re.MULTILINE
    )
    displayed_titles = [match[1] for match in displayed_title_matches]
    displayed_heart = bool(displayed_title_matches and displayed_title_matches[0][0])
    displayed_bullets = re.findall(r"^> - (.+?)\s*$", cue_section, re.MULTILINE)
    title = ""
    if len(displayed_titles) != 1:
        errors.append(f"expected one visible cue-card title, found {len(displayed_titles)}")
    else:
        title = displayed_titles[0]
        heart_prefix = "❤️ " if source_has_heart(title) else ""
        expected_stem = heart_prefix + title.rstrip(".?!").replace("/", " or ")
        if path.stem != expected_stem:
            errors.append("filename does not match the sanitized Cue Card title")
    if not re.search(r"^> \*\*You should say:\*\*\s*$", cue_section, re.MULTILINE):
        errors.append("visible Cue Card is missing 'You should say'")
    expected_cue = source_cue(title) if title else None
    if expected_cue is None:
        errors.append("visible cue-card title was not found in topic-bank.md")
    elif displayed_bullets != expected_cue[1]:
        errors.append(
            "visible Cue Card bullets do not exactly match topic-bank.md "
            f"(expected {len(expected_cue[1])}, found {len(displayed_bullets)})"
        )
    if title and displayed_heart != source_has_heart(title):
        errors.append("visible cue-card heart marker does not match topic-bank.md")

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
    if total and not 0.42 <= narrative_ratio <= 0.48:
        errors.append(
            f"narrative is {narrative_ratio:.1%}; expected 42–48%"
        )
    if total and not 0.52 <= reflection_ratio <= 0.58:
        errors.append(
            f"reflection is {reflection_ratio:.1%}; expected 52–58%"
        )

    ability_section = ""
    if ABILITY_HEADING in text and STORY_HEADING in text:
        ability_section = between(text, ABILITY_HEADING, STORY_HEADING)
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
    if STORY_HEADING in text and ANSWER_HEADING in text:
        story_section = between(text, STORY_HEADING, ANSWER_HEADING)
    for field in ("Who/What", "Background", "Main event", "Ability shown", "Reflection"):
        if not re.search(rf"^- {re.escape(field)}:\s*\S", story_section, re.MULTILINE):
            errors.append(f"Story Bank field {field!r} is missing or empty")

    collocation_section = ""
    if COLLOCATION_HEADING in text:
        collocation_section = text.split(COLLOCATION_HEADING, 1)[1]
    collocations = [
        item.strip()
        for item in re.findall(r"^-\s+(.+?)\s*$", collocation_section, re.MULTILINE)
        if item.strip()
    ]
    if len(collocations) != 8:
        errors.append(f"found {len(collocations)} collocations; expected exactly 8")
    if len(collocations) != len(set(collocations)):
        errors.append("collocations must be unique")
    fixed_collocations = source_bank_collocations(selected_bank) if selected_bank else []
    if len(fixed_collocations) != 3:
        errors.append(
            f"could not resolve the 3 fixed collocations for {selected_bank or 'the Bank'}"
        )
    else:
        missing_fixed = [item for item in fixed_collocations if item not in collocations]
        if missing_fixed:
            errors.append(
                "missing fixed Bank collocations: " + ", ".join(missing_fixed)
            )
    reuse_corpus = source_collocation_corpus()
    novel_collocations = [
        item for item in collocations if item.lower() not in reuse_corpus
    ]
    if len(novel_collocations) > 2:
        errors.append(
            "more than 2 collocations are new rather than reused: "
            + ", ".join(novel_collocations)
        )

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
        "cue_bullets": len(displayed_bullets),
        "fixed_collocations": len(
            [item for item in fixed_collocations if item in collocations]
        ),
        "reused_collocations": len(collocations) - len(novel_collocations),
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
            f"cue_bullets={stats['cue_bullets']}, modules={stats['modules']}, "
            f"abilities={stats['abilities']}, "
            f"collocations={stats['collocations']} "
            f"(fixed={stats['fixed_collocations']}, "
            f"reused={stats['reused_collocations']})"
        )
        for error in errors:
            print(f"  - {error}")
        failed = failed or bool(errors)
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
