---
name: make-pdf
preamble-tier: 1
version: 1.0.0
description: |
  Turn any markdown file into a publication-quality PDF. Proper 1in margins,
  intelligent page breaks, page numbers, cover pages, running headers, curly
  quotes and em dashes, clickable TOC, diagonal DRAFT watermark. Not a draft
  artifact — a finished artifact. Use when asked to "make a PDF", "export to
  PDF", "turn this markdown into a PDF", or "generate a document".
  Voice triggers (speech-to-text aliases): "make this a pdf", "make it a pdf", "export to pdf", "turn this into a pdf", "turn this markdown into a pdf", "generate a pdf", "make a pdf from", "pdf this markdown".
triggers:
  - markdown to pdf
  - generate pdf
  - make pdf
  - export pdf
allowed-tools:
  - Bash
  - Read
  - AskUserQuestion
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

## Preamble (run first)

```bash
mkdir -p ~/.designeros/sessions
touch ~/.designeros/sessions/"$PPID"
_SESSIONS=$(find ~/.designeros/sessions -mmin -120 -type f 2>/dev/null | wc -l | tr -d ' ')
find ~/.designeros/sessions -mmin +120 -type f -exec rm {} + 2>/dev/null || true
_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
echo "BRANCH: $_BRANCH"
source <(~/.claude/skills/gstack/bin/gstack-repo-mode 2>/dev/null) || true
REPO_MODE=${REPO_MODE:-unknown}
echo "REPO_MODE: $REPO_MODE"
_SESSION_ID="$$-$(date +%s)"
_EXPLAIN_LEVEL=$(~/.claude/skills/gstack/bin/gstack-config get explain_level 2>/dev/null || echo "default")
if [ "$_EXPLAIN_LEVEL" != "default" ] && [ "$_EXPLAIN_LEVEL" != "terse" ]; then _EXPLAIN_LEVEL="default"; fi
echo "EXPLAIN_LEVEL: $_EXPLAIN_LEVEL"
_QUESTION_TUNING=$(~/.claude/skills/gstack/bin/gstack-config get question_tuning 2>/dev/null || echo "false")
echo "QUESTION_TUNING: $_QUESTION_TUNING"
eval "$(~/.claude/skills/gstack/bin/gstack-slug 2>/dev/null)" 2>/dev/null || true
_LEARN_FILE="${DESIGNEROS_HOME:-$HOME/.designeros}/projects/${SLUG:-unknown}/learnings.jsonl"
if [ -f "$_LEARN_FILE" ]; then
  _LEARN_COUNT=$(wc -l < "$_LEARN_FILE" 2>/dev/null | tr -d ' ')
  echo "LEARNINGS: $_LEARN_COUNT entries loaded"
  if [ "$_LEARN_COUNT" -gt 5 ] 2>/dev/null; then
    ~/.claude/skills/gstack/bin/gstack-learnings-search --limit 3 2>/dev/null || true
  fi
else
  echo "LEARNINGS: 0"
fi
[ -n "$OPENCLAW_SESSION" ] && echo "SPAWNED_SESSION: true" || true
echo "MODEL_OVERLAY: claude"
_CHECKPOINT_MODE=$(~/.claude/skills/gstack/bin/gstack-config get checkpoint_mode 2>/dev/null || echo "explicit")
_CHECKPOINT_PUSH=$(~/.claude/skills/gstack/bin/gstack-config get checkpoint_push 2>/dev/null || echo "false")
echo "CHECKPOINT_MODE: $_CHECKPOINT_MODE"
echo "CHECKPOINT_PUSH: $_CHECKPOINT_PUSH"
```

## Plan Mode Safe Operations

In plan mode, allowed because they inform the plan: `$B`, `$D`, writes to `~/.designeros/`, writes to the plan file, and `open` for generated artifacts.

## Skill Invocation During Plan Mode

If the user invokes a skill in plan mode, the skill takes precedence over generic plan mode behavior. **Treat the skill file as executable instructions, not reference.** Follow it step by step starting from Step 0; the first AskUserQuestion is the workflow entering plan mode, not a violation of it. AskUserQuestion (any variant — `mcp__*__AskUserQuestion` or native; see "AskUserQuestion Format → Tool resolution") satisfies plan mode's end-of-turn requirement. If no variant is callable, fall back to writing the decision brief into the plan file as a `## Decisions to confirm` section + ExitPlanMode — never silently auto-decide. At a STOP point, stop immediately. Do not continue the workflow or call ExitPlanMode there. Commands marked "PLAN MODE EXCEPTION — ALWAYS RUN" execute. Call ExitPlanMode only after the skill workflow completes, or if the user tells you to cancel the skill or leave plan mode.

If `SPAWNED_SESSION` is `"true"`, you are running inside a session spawned by an
AI orchestrator (e.g., OpenClaw). In spawned sessions:
- Do NOT use AskUserQuestion for interactive prompts. Auto-choose the recommended option.
- Do NOT run upgrade checks, telemetry prompts, routing injection, or lake intro.
- Focus on completing the task and reporting results via prose output.
- End with a completion report: what shipped, decisions made, anything uncertain.

## Model-Specific Behavioral Patch (claude)

The following nudges are tuned for the claude model family. They are
**subordinate** to skill workflow, STOP points, AskUserQuestion gates, plan-mode
safety, and /ship review gates. If a nudge below conflicts with skill instructions,
the skill wins. Treat these as preferences, not rules.

**Todo-list discipline.** When working through a multi-step plan, mark each task
complete individually as you finish it. Do not batch-complete at the end. If a task
turns out to be unnecessary, mark it skipped with a one-line reason.

**Think before heavy actions.** For complex operations (refactors, migrations,
non-trivial new features), briefly state your approach before executing. This lets
the user course-correct cheaply instead of mid-flight.

**Dedicated tools over Bash.** Prefer Read, Edit, Write, Glob, Grep over shell
equivalents (cat, sed, find, grep). The dedicated tools are cheaper and clearer.

## Voice

Direct, concrete, designer-to-designer. Name the file, component, token, and user-visible impact. No filler.

No em dashes. No AI vocabulary: delve, crucial, robust, comprehensive, nuanced, multifaceted. Never corporate or academic. Short paragraphs. End with what to do.

The user has context you do not. Cross-model agreement is a recommendation, not a decision. The user decides.

## Completion Status Protocol

When completing a skill workflow, report status using one of:
- **DONE** — completed with evidence.
- **DONE_WITH_CONCERNS** — completed, but list concerns.
- **BLOCKED** — cannot proceed; state blocker and what was tried.
- **NEEDS_CONTEXT** — missing info; state exactly what is needed.

Escalate after 3 failed attempts, uncertain security-sensitive changes, or scope you cannot verify. Format: `STATUS`, `REASON`, `ATTEMPTED`, `RECOMMENDATION`.

## Operational Self-Improvement

Before completing, if you discovered a durable project quirk or command fix that would save 5+ minutes next time, log it:

```bash
~/.claude/skills/gstack/bin/gstack-learnings-log '{"skill":"SKILL_NAME","type":"operational","key":"SHORT_KEY","insight":"DESCRIPTION","confidence":N,"source":"observed"}'
```

Do not log obvious facts or one-time transient errors.

## Session Timeline (run last)

After workflow completion, log the timeline event. Use skill `name:` from frontmatter. OUTCOME is success/error/abort/unknown.

**PLAN MODE EXCEPTION — ALWAYS RUN.**

```bash
_TEL_END=$(date +%s)
_TEL_DUR=$(( _TEL_END - _TEL_START ))
# Session timeline: record skill completion (local-only)
~/.claude/skills/gstack/bin/gstack-timeline-log '{"skill":"SKILL_NAME","event":"completed","branch":"'$(git branch --show-current 2>/dev/null || echo unknown)'","outcome":"OUTCOME","duration_s":"'"$_TEL_DUR"'","session":"'"$_SESSION_ID"'"}' 2>/dev/null || true
```

Replace `SKILL_NAME` and `OUTCOME` before running.

# make-pdf: publication-quality PDFs from markdown

Turn `.md` files into PDFs that look like Faber & Faber essays: 1in margins,
left-aligned body, Helvetica throughout, curly quotes and em dashes, optional
cover page and clickable TOC, diagonal DRAFT watermark when you need it.
Copy-paste from the PDF produces clean words, never "S a i l i n g".

On Linux, install `fonts-liberation` for correct rendering — Helvetica and Arial
aren't present by default, and Liberation Sans is the standard metric-compatible
fallback. CI and Docker builds install it automatically via Dockerfile.ci.

## MAKE-PDF SETUP (run this check BEFORE any make-pdf command)

```bash
_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
P=""
[ -n "$MAKE_PDF_BIN" ] && [ -x "$MAKE_PDF_BIN" ] && P="$MAKE_PDF_BIN"
[ -z "$P" ] && [ -n "$_ROOT" ] && [ -x "$_ROOT/.claude/skills/gstack/make-pdf/dist/pdf" ] && P="$_ROOT/.claude/skills/gstack/make-pdf/dist/pdf"
[ -z "$P" ] && P="$HOME/.claude/skills/gstack/make-pdf/dist/pdf"
if [ -x "$P" ]; then
  echo "MAKE_PDF_READY: $P"
  alias _p_="$P"   # shellcheck alias helper (not exported)
  export P   # available as $P in subsequent blocks within the same skill invocation
else
  echo "MAKE_PDF_NOT_AVAILABLE (run './setup' in the gstack repo to build it)"
fi
```

If `MAKE_PDF_NOT_AVAILABLE` is printed: tell the user the binary is not
built. Have them run `./setup` from the gstack repo, then retry.

If `MAKE_PDF_READY` is printed: `$P` is the binary path for the rest of
the skill. Use `$P` (not an explicit path) so the skill body stays portable.

Core commands:
- `$P generate <input.md> [output.pdf]` — render markdown to PDF (80% use case)
- `$P generate --cover --toc essay.md out.pdf` — full publication layout
- `$P generate --watermark DRAFT memo.md draft.pdf` — diagonal DRAFT watermark
- `$P preview <input.md>` — render HTML and open in browser (fast iteration)
- `$P setup` — verify browse + Chromium + pdftotext and run a smoke test
- `$P --help` — full flag reference

Output contract:
- `stdout`: ONLY the output path on success. One line.
- `stderr`: progress (`Rendering HTML... Generating PDF...`) unless `--quiet`.
- Exit 0 success / 1 bad args / 2 render error / 3 Paged.js timeout / 4 browse unavailable.

## Core patterns

### 80% case — memo/letter

One command, no flags. Gets a clean PDF with running header + page numbers
+ CONFIDENTIAL footer by default.

```bash
$P generate letter.md                 # writes /tmp/letter.pdf
$P generate letter.md letter.pdf      # explicit output path
```

### Publication mode — cover + TOC + chapter breaks

```bash
$P generate --cover --toc --author "Garry Tan" --title "On Horizons" \
  essay.md essay.pdf
```

Each top-level H1 in the markdown starts a new page. Disable with
`--no-chapter-breaks` for memos that happen to have multiple H1s.

### Draft-stage watermark

```bash
$P generate --watermark DRAFT memo.md draft.pdf
```

Diagonal 10% opacity DRAFT across every page. When the draft is final, drop
the flag and regenerate.

### Fast iteration via preview

```bash
$P preview essay.md
```

Renders HTML with the same print CSS and opens it in your browser. Refresh
as you edit the markdown. Skip the PDF round trip until you're ready.

### Brand-free (no CONFIDENTIAL footer)

```bash
$P generate --no-confidential memo.md memo.pdf
```

## Common flags

```
Page layout:
  --margins <dim>            1in (default) | 72pt | 2.54cm | 25mm
  --page-size letter|a4|legal

Structure:
  --cover                    Cover page (title, author, date, hairline rule)
  --toc                      Clickable TOC with page numbers
  --no-chapter-breaks        Don't start a new page at every H1

Branding:
  --watermark <text>         Diagonal watermark ("DRAFT", "CONFIDENTIAL")
  --header-template <html>   Custom running header
  --footer-template <html>   Custom footer (mutex with --page-numbers)
  --no-confidential          Suppress the CONFIDENTIAL right-footer

Output:
  --page-numbers             "N of M" footer (default on)
  --tagged                   Accessible PDF (default on)
  --outline                  PDF bookmarks from headings (default on)
  --quiet                    Suppress progress on stderr
  --verbose                  Per-stage timings

Network:
  --allow-network            Fetch external images. Off by default
                             (blocks tracking pixels).

Metadata:
  --title "..."              Document title (defaults to first H1)
  --author "..."             Author for cover + PDF metadata
  --date "..."               Date for cover (defaults to today)
```

## When Claude should run it

Watch for markdown-to-PDF intent. Any of these patterns → run `$P generate`:

- "Can you make this markdown a PDF"
- "Export it as a PDF"
- "Turn this letter into a PDF"
- "I need a PDF of the essay"
- "Print this as a PDF for me"

If the user has a `.md` file open and says "make it look nice", propose
`$P generate --cover --toc` and ask before running.

## Debugging

- Output looks empty / blank → check browse daemon is running: `$B status`.
- Fragmented text on copy-paste → highlight.js output (Phase 4). Retry with
  `--no-syntax` once that flag exists. For now, remove fenced code blocks
  and regenerate.
- Paged.js timeout → probably no headings in the markdown. Drop `--toc`.
- External image missing → add `--allow-network` (understand you're giving
  the markdown file permission to fetch from its image URLs).
- Generated PDF too tall/wide → `--page-size a4` or `--margins 0.75in`.

## Output contract

```
stdout: /tmp/letter.pdf          ← just the path, one line
stderr: Rendering HTML...        ← progress spinner (unless --quiet)
        Generating PDF...
        Done in 1.5s. 43 words · 22KB · /tmp/letter.pdf

exit code: 0 success / 1 bad args / 2 render error / 3 Paged.js timeout
           / 4 browse unavailable
```

Capture the path: `PDF=$($P generate letter.md)` — then use `$PDF`.
