# Every Session Is Groundhog Day for Your AI

**By [Amit Prusty](https://github.com/cote-star)** &nbsp;·&nbsp; [github.com/cote-star/groundhog-day-for-agents](https://github.com/cote-star/groundhog-day-for-agents)

A talk on context, continuity, harnesses, and memory.
HTML deck (reveal.js + custom cinema CSS + Web Audio cues).

> *We keep mistaking context for continuity.*

[![Pages](https://img.shields.io/badge/live-github.io-blue)](https://cote-star.github.io/groundhog-day-for-agents/) &nbsp; ![license-mit](https://img.shields.io/badge/license-MIT-green)

Two editions:

| Edition | URL |
|---|---|
| Original (internal team talk, May 2026) | [cote-star.github.io/groundhog-day-for-agents](https://cote-star.github.io/groundhog-day-for-agents/) |
| **Claude Edition** — *a harness-engineering field guide to memory, context, and continuity* (Claude Community Meetup Amsterdam, June 2026) | […/claude-edition/](https://cote-star.github.io/groundhog-day-for-agents/claude-edition/) |

---

## Run it locally

    git clone https://github.com/cote-star/groundhog-day-for-agents
    cd groundhog-day-for-agents
    python3 -m http.server 8000

Then open `http://localhost:8000/` (or `/claude-edition/`).

## Controls

| Key | What it does |
|---|---|
| `→` / `Space` | Next slide or fragment |
| `←` | Previous |
| `F` | Fullscreen |
| `Esc` | Slide overview grid |
| `B` | Pause to black |
| `R` | Replay the credits roll (on the credits slide) |

Sound is synthesized live in Web Audio — it unlocks on your first keypress.
Best experienced without reading ahead.

Presenter materials (speaker notes, talking points) are intentionally not
part of this repo.

---

## Image attribution

### CC photos via Wikimedia Commons

- `phil.jpg` — *Punxsutawney Phil 2018* — CC BY-SA 4.0
- `alarm-clock-windup.jpg` — *Black windup alarm clock face* — CC license per Commons
- `alarm-clock.jpg` — *Alarm clock from the 1990s* — CC license per Commons
- `bulletin-board.jpg` — *Bulletin board* — CC license per Commons
- `blender.jpg` — *Vitamix 5200 Blender* — CC license per Commons
- `card-catalog.jpg` — *Card catalog at the Indiana State Library* — CC license per Commons
- `polaroid-print.jpg` — *Polaroid Instant Film 01* — CC license per Commons
- `snow-town.jpg` — *Bad Schandau Kipphornaussicht* — CC license per Commons
- `vhs-cassette.png`, `vhs-sunset.jpg` — VHS-themed Commons files

Footer attribution line is baked into every slide for transparency.

### Movie posters — fair-use rationale

- `poster-groundhog-day.jpg` — *Groundhog Day* (1993) theatrical poster.
  © Columbia Pictures. 250px Wikipedia thumbnail.
- `poster-memento.jpg` — *Memento* (2000) theatrical poster.
  © Newmarket Films / Summit Entertainment. 250px Wikipedia thumbnail.

Both posters are used at low resolution, in a non-commercial educational
presentation, as direct illustrative commentary on the films themselves —
which are explicitly named, framed as cultural reference points, and
critically discussed as metaphors for agent memory architecture. This is
the standard *commentary, criticism, and education* fair-use case under
17 U.S.C. § 107.
