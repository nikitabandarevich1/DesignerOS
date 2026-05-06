# DesignerOS — AI Design Workflow for Factorial Webpage

DesignerOS is a personal AI skills toolkit for Nikita, a designer/design engineer at Factorial.
It gives OpenCode structured roles for working on the `webpage/` Next.js 15 marketing site —
DatoCMS, Tailwind design tokens, Framer Motion, GSAP, OxFmt, multi-TLD locales, and more.

Skills are installed globally at `~/.config/opencode/skills/` (or `~/.agents/skills/`).
Invoke them by name (e.g., `/start`, `/new-section`).

## Meta-workflow skills (start here)

| Skill | What it does |
|-------|-------------|
| `/start` | Universal entry point. Describe what you want to build — scopes the brief and routes you to the right workflow. |
| `/new-section` | End-to-end: build a new CMS-driven section. Scope → implement → polish → QA. |
| `/new-page` | End-to-end: build a new page or landing page. Route → sections → SEO/i18n → QA. |
| `/animate-this` | Animation workflow. Decides whether/how to animate, picks the library, implements, QAs. |
| `/design-audit` | Multi-lens design audit. Visual quality, animation, perf, locale, a11y in one report. |
| `/ship-it` | Pre-ship gate. Code review → QA → release notes → docs → PR. |

## Webpage development

| Skill | What it does |
|-------|-------------|
| `/webpage` | General webpage architecture, conventions, and patterns. |
| `/webpage-cms-component` | Build a new DatoCMS-driven section component. |
| `/webpage-page` | Build a new page or route. |
| `/webpage-design-system` | Work with design tokens, atoms/molecules/organisms, Storybook. |
| `/datocms-migration` | Create and run DatoCMS schema migrations. |

## Animation & interaction

| Skill | What it does |
|-------|-------------|
| `/design-engineer` | Whether and how to add polish — the invisible details that make UI feel great. |
| `/gsap-scrolltrigger` | GSAP ScrollTrigger — pinning, scrub, scroll-linked animations. |
| `/nextjs-framer-motion` | Framer Motion in Next.js — whileInView, AnimatePresence, layout transitions. |
| `/scroll-experience` | Immersive scroll storytelling — parallax, cinematic, Apple-style. |
| `/premium-frontend-ui` | Premium UI quality — hero architecture, entry sequences, magnetic interactions. |

## Planning & review

| Skill | What it does |
|-------|-------------|
| `/office-hours` | Reframe a product idea before writing code. |
| `/plan-design-review` | Rate each design dimension 0-10, explain what a 10 looks like. |
| `/autoplan` | Run all reviews (design, eng) in one command. |
| `/scope-challenge` | Challenge or reframe the brief before committing. |

## Implementation & QA

| Skill | What it does |
|-------|-------------|
| `/review` | Pre-PR code review. Finds bugs that pass CI but break in prod. |
| `/investigate` | Systematic root-cause debugging. No fixes without investigation. |
| `/design-review` | Live-site visual audit + fix loop. |
| `/qa` | Open a real browser, find bugs, fix them, re-verify. |
| `/qa-only` | Same as /qa but report only — no code changes. |
| `/benchmark` | Performance regression detection. Core Web Vitals, LCP, ISR config. |

## Release & docs

| Skill | What it does |
|-------|-------------|
| `/release-notes` | Generate release notes / changelog from git history. |
| `/document-release` | Update all docs to match what was just shipped. |

## Browser & tools

| Skill | What it does |
|-------|-------------|
| `/browse` | Headless Chromium — real clicks, ~100ms/command. |
| `/setup-browser-cookies` | Import cookies from your real browser for authenticated testing. |

## Session memory

| Skill | What it does |
|-------|-------------|
| `/context-save` | Save working context (git state, decisions, remaining work). |
| `/context-restore` | Resume from a saved context. |
| `/learn` | Manage what DesignerOS has learned across sessions. |

## Maintenance

| Skill | What it does |
|-------|-------------|
| `/designeros-upgrade` | Update DesignerOS to the latest version. |

## Build commands

```bash
cd ~/code/DesignerOS
~/.bun/bin/bun run gen:skill-docs          # regenerate SKILL.md files from templates
PATH="$HOME/.bun/bin:$PATH" ./setup --host opencode --no-prefix   # install/reinstall
```

## Key conventions

- `SKILL.md` files are **generated** from `.tmpl` templates. Edit the template, not the output.
- Run `gen:skill-docs` after editing any `.tmpl` file, then re-run `setup`.
- State lives in `~/.designeros/`.
- Scope: exclusively the `webpage/` project. Not frontend/, backend/, or mobile/.
