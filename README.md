# Every Session Is Groundhog Day for Your AI

**By [Amit Prusty](https://github.com/cote-star)** &nbsp;·&nbsp; [github.com/cote-star/groundhog-day-for-agents](https://github.com/cote-star/groundhog-day-for-agents)

A 30-min team talk on context, continuity, harnesses, and memory.
HTML deck (reveal.js + custom cinema CSS + Web Audio gags).

> *We keep mistaking context for continuity.*

[![Pages](https://img.shields.io/badge/live-github.io-blue)](https://cote-star.github.io/groundhog-day-for-agents/) &nbsp; ![license-mit](https://img.shields.io/badge/license-MIT-green)

---

## Present it

The deck is a single static site. Two ways to run it:

### Option A — Already running via preview

A `python3 -m http.server` is wired in `.claude/launch.json` (the Claude harness's
`preview_start` started it on port 8765). Open:

    http://localhost:8765/

### Option B — Just open the file

    open /Users/e059303/sandbox/play/groundhog-day-talk/index.html

(Some browsers limit fonts/JS from `file://`. If the deck looks ugly, use Option A.)

### Option C — Start your own server

    cd /Users/e059303/sandbox/play/groundhog-day-talk
    python3 -m http.server 8000

Then open `http://localhost:8000/`.

---

## Controls during the talk

| Key | What it does |
|---|---|
| `→` / `Space` | Next slide or fragment |
| `←` | Previous |
| `S` | Open speaker-notes window (all 15 slides have notes) |
| `F` | Fullscreen |
| `Esc` | Slide overview grid |
| `B` | Pause to black |
| `Shift+B` | Manually bump the BOOOO counter (panic key) |
| `Shift+R` | Manually fire the Groundhog Day reset gag |
| `Shift+S` | Manually fire the fake `<system-reminder>` overlay |
| `Shift+C` | Manually fire the compaction shrink animation |
| `R` | Replay the cinema credits roll (only active on slide 16) |

The `Shift+*` shortcuts exist so you can re-trigger gags if they didn't land —
e.g. if the room missed the alarm-clock flash, hit `Shift+R` to repeat it.

---

## The 16-slide spine

1. **Cold open** — alarm clock + title
2. **The refrain** — *we keep mistaking context for continuity* (the line you'll repeat 3×)
3. **The frame** — Groundhog Day is the UX. Memento is the mechanism. *(actual film posters, fair-use thumbnails)*
4. **Why #1** — Frozen weights
5. **Why #2** — Alignment teaches manners, not memory
6. **Why #3** — The harness is the prosthetic
7. **Receipts** — Mario's pain points on a corkboard *(fake system-reminder overlay fires here)*
8. **Groundhog Day reset** — the gag *(alarm flash + 06:00 readout)*
9. **Where the heartbeat lives** — Claude Code vs Codex from the agentway.dev book
10. **Bigger desk, not better memory** — Lost-in-the-Middle visualization
11. **Compaction is REM sleep with data loss** — slide visibly compacts on fragment
12. **The agent's hippocampus is a markdown file** — polaroid wall of solutions
13. **Your codebase is not a smoothie** — vector RAG vs PageIndex/vectorless
14. **Where do the tattoos live?** — storage / invalidation / ownership open questions
15. **Your agent has no biography. Yet.** — closer + 3 discussion prompts
16. **Cinema credits roll** — full scrolling movie credits (~55s). Press `R` to replay.

---

## What's in the folder

    groundhog-day-talk/
    ├── index.html              ← the deck
    ├── css/cinema.css          ← film grain, VHS, polaroid, Memento styling
    ├── js/effects.js           ← BOOOO counter, system-reminder pop-up,
    │                              compaction animation, GD reset, Web Audio
    │                              alarm/glitch synthesis
    ├── lib/                    ← reveal.js 5.1.0 (downloaded locally)
    ├── assets/images/          ← Wikimedia Commons photos (CC-BY-SA / CC0)
    │   ├── phil.jpg            ← Punxsutawney Phil (cold open optional swap)
    │   ├── alarm-clock-windup.jpg
    │   ├── bulletin-board.jpg  ← receipts corkboard background
    │   ├── blender.jpg         ← Vitamix, "your codebase is not a smoothie"
    │   ├── card-catalog.jpg    ← vectorless RAG visual
    │   └── ...
    └── .claude/launch.json     ← preview server config

---

## Shoutouts to plant during the talk

- **Mario** — *Building pi in a world of slop*. The "your context isn't your context"
  and "sufficiently detailed spec is a program" lines come straight from him.
  https://www.youtube.com/watch?v=RjfbvDXpFls
- **agentway.dev** — the comparative harness book (`book2-comparing-en.pdf`).
  Chapter 3 *"Where the Heartbeat Lives"* is exactly the framing slide 9 uses.
- **Walking Labs** — `learn-harness-engineering`. Harness engineering as a real discipline.
- **arXiv:2605.18747** — harness survey paper.
- **Liu et al. (Lost in the Middle, 2023)** — cited on the bigger-desk slide.
- **VectifyAI** — PageIndex, the vectorless RAG project.
  https://github.com/VectifyAI/PageIndex
- **Garry Tan** — `gbrain`, the YC-president-builds-his-own-agent-brain proof point.
  https://github.com/garrytan/gbrain
- **Anthropic blog** — *How Claude Code works in large codebases* (context as a scarce budget).

---

## Known minor cosmetic issues

- A couple of slides (compaction, vectorless) have their last fragment partially
  clipped at the bottom edge in some viewport sizes. The content itself is fine;
  the visible portion of every slide carries the joke. If it bothers you in your
  3 hours of prep, shrink the relevant `font-size` in `css/cinema.css`.
- Web Audio (alarm bell, glitch blip) needs a click or keypress before the
  browser unlocks it. The first arrow-key press handles this.

---

## Deploying (optional, post-talk)

If you want to share the deck after:

- **GitHub Pages (play side):** drop the folder into any play repo, set Pages
  to serve from root, and you have a public URL. Use `gh-play` per play CLAUDE.md.
- **Vercel (temporary):** `vercel deploy --prod` from the folder works as a
  static site (no build step). Confirm-tier — needs explicit human approval.
- **Local file:** the whole folder is self-contained except Google Fonts (CDN)
  and reveal.js (downloaded locally). Zips fine.

Final publish is confirm-tier per play policy — ask first.

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

The fair-use rationale weakens if this deck is published publicly long-term.
For internal team viewings and short-term Vercel/Pages deployment, the
posture is reasonable. For permanent public hosting, swap the poster files
for CSS-art renditions or remove them entirely — the talk works without
them. Attribution is present in the on-deck credits scene (slide 16).
