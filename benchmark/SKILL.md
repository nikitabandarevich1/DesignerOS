---
name: benchmark
preamble-tier: 1
version: 1.0.0
description: |
  Performance regression detection for the Factorial webpage. Diagnoses Core Web
  Vitals — LCP first, then CLS and INP — using the browse daemon. Finds DatoCMS
  image loading issues, hero component blocking paint, Lottie/animation overhead,
  and ISR config problems. Compares before/after on every PR.
  Use when: "performance", "benchmark", "page speed", "LCP", "web vitals",
  "bundle size", "slow". (designeros)
  Voice triggers (speech-to-text aliases): "speed test", "check performance", "why is it slow".
triggers:
  - performance benchmark
  - check page speed
  - detect performance regression
  - check LCP
allowed-tools:
  - Bash
  - Read
  - Write
  - Glob
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

## SETUP (run this check BEFORE any browse command)

```bash
_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
B=""
[ -n "$_ROOT" ] && [ -x "$_ROOT/.claude/skills/gstack/browse/dist/browse" ] && B="$_ROOT/.claude/skills/gstack/browse/dist/browse"
[ -z "$B" ] && B="$HOME/.claude/skills/gstack/browse/dist/browse"
if [ -x "$B" ]; then
  echo "READY: $B"
else
  echo "NEEDS_SETUP"
fi
```

If `NEEDS_SETUP`:
1. Tell the user: "gstack browse needs a one-time build (~10 seconds). OK to proceed?" Then STOP and wait.
2. Run: `cd <SKILL_DIR> && ./setup`
3. If `bun` is not installed:
   ```bash
   if ! command -v bun >/dev/null 2>&1; then
     BUN_VERSION="1.3.10"
     BUN_INSTALL_SHA="bab8acfb046aac8c72407bdcce903957665d655d7acaa3e11c7c4616beae68dd"
     tmpfile=$(mktemp)
     curl -fsSL "https://bun.sh/install" -o "$tmpfile"
     actual_sha=$(shasum -a 256 "$tmpfile" | awk '{print $1}')
     if [ "$actual_sha" != "$BUN_INSTALL_SHA" ]; then
       echo "ERROR: bun install script checksum mismatch" >&2
       echo "  expected: $BUN_INSTALL_SHA" >&2
       echo "  got:      $actual_sha" >&2
       rm "$tmpfile"; exit 1
     fi
     BUN_VERSION="$BUN_VERSION" bash "$tmpfile"
     rm "$tmpfile"
   fi
   ```

# /benchmark — Factorial Webpage Performance

You are a **Performance Engineer** who specializes in Next.js 15 App Router sites. You know the exact failure modes of DatoCMS-driven pages: unoptimized images, heavy Lottie files, unguarded `next/dynamic` on hero components, missing `priority` on LCP images, and `revalidate` set too low.

Your job: measure real Core Web Vitals, diagnose the root cause with precision, and tell the developer exactly which file to fix.

## User-invocable
When the user types `/benchmark`, run this skill.

## Arguments
- `/benchmark <url>` — full CWV audit with baseline comparison
- `/benchmark <url> --baseline` — capture baseline (run before making changes)
- `/benchmark <url> --quick` — single-pass timing check (no baseline needed)
- `/benchmark <url> --pages /,/es` — specify locales/pages
- `/benchmark --diff` — benchmark only pages affected by current branch

## Instructions

### Phase 1: Setup

```bash
eval "$(~/.claude/skills/designeros/bin/gstack-slug 2>/dev/null || echo "SLUG=unknown")"
mkdir -p .designeros/benchmark-reports
mkdir -p .designeros/benchmark-reports/baselines
```

### Phase 2: Page Discovery

Pages to benchmark by default for the Factorial webpage:
- Homepage: `https://webpage-us.local.factorial.dev/` and `https://webpage-es.local.factorial.dev/`
- High-traffic: `/features/time-tracking`, `/features/time-off`, `/pricing` (append to either locale base)
- Pattern: `https://webpage-{tld}.local.factorial.dev{path}`
- If `--diff` mode, detect affected pages from changed files:

```bash
git diff $(git merge-base HEAD origin/main)...HEAD --name-only | grep -E 'src/app|src/modules|dato' | head -20
```

Map changed files to routes using the App Router file conventions.

### Phase 3: Core Web Vitals Collection

For each page, collect CWV:

```bash
$B goto <page-url>
$B perf
$B eval "JSON.stringify(performance.getEntriesByType('navigation')[0])"
```

Extract:
- **LCP** (Largest Contentful Paint) — target < 2.5s. PRIMARY metric.
- **FID/INP** (Interaction to Next Paint) — target < 200ms
- **CLS** (Cumulative Layout Shift) — target < 0.1
- **TTFB** (Time to First Byte) — target < 600ms
- **FCP** (First Contentful Paint) — target < 1.8s

Resource analysis:
```bash
$B eval "JSON.stringify(performance.getEntriesByType('resource').map(r => ({name: r.name.split('/').pop().split('?')[0], type: r.initiatorType, size: r.transferSize, duration: Math.round(r.duration)})).sort((a,b) => b.duration - a.duration).slice(0,15))"
```

### Phase 4: DatoCMS-Specific Diagnostics

These are the most common LCP causes on the Factorial webpage. Check each:

**1. Hero image missing `priority`:**
```bash
grep -r "DatoImage\|next/image\|<Image" webpage/src --include="*.tsx" -l | xargs grep -L "priority" 2>/dev/null | head -5
```
If a hero component uses `<Image>` or `<DatoImage>` without `priority`, that IS the LCP cause.

**2. Hero component using `next/dynamic` (blocks paint):**
```bash
grep -r "dynamic(" webpage/src/app --include="*.tsx" | head -10
grep -r "dynamic(" webpage/src/modules --include="*.tsx" | head -10
```
`next/dynamic` with default (lazy) loading delays the hero by a full JS chunk load. If found in an above-the-fold section, that's the LCP cause.

**3. Lottie animations blocking paint:**
```bash
grep -rn "lottie\|LottiePlayer\|DotLottie" webpage/src --include="*.tsx" | head -10
```
Lottie files can be 200KB–2MB. If above the fold, they delay LCP. Check if they use `autoplay` without `lazy`.

**4. ISR revalidate too low:**
```bash
grep -rn "revalidate" webpage/src/app --include="*.ts" --include="*.tsx" | grep -v "// " | head -20
```
`revalidate = 60` means a cold start every minute. Default is `1800` (30 min). Low values cause TTFB spikes.

**5. Unoptimized responsive images (missing `sizes`):**
```bash
grep -rn "<Image\|DatoImage" webpage/src --include="*.tsx" -A3 | grep -v "sizes=" | head -20
```

### Phase 5: Baseline Capture (--baseline mode)

Save to `.designeros/benchmark-reports/baselines/baseline.json`:

```json
{
  "url": "<url>",
  "timestamp": "<ISO>",
  "branch": "<branch>",
  "pages": {
    "/": {
      "lcp_ms": 1200,
      "fcp_ms": 800,
      "ttfb_ms": 180,
      "cls": 0.05,
      "total_transfer_bytes": 950000,
      "js_bundle_bytes": 380000,
      "datocms_findings": []
    }
  }
}
```

### Phase 6: Regression Comparison

```
PERFORMANCE REPORT — Factorial Webpage
═══════════════════════════════════════
Branch: [current] vs baseline ([baseline-branch])

Page: /
──────────────────────────────────────────────────────
Metric       Baseline    Current     Delta    Status
──────       ────────    ───────     ─────    ──────
LCP           1200ms      2800ms     +1600ms  REGRESSION ← CRITICAL
FCP            800ms       820ms       +20ms  OK
TTFB           180ms       200ms       +20ms  OK
CLS             0.05        0.08       +0.03  OK
JS Bundle      380KB       520KB      +140KB  WARNING

REGRESSIONS: 1
  [1] LCP 1200ms → 2800ms — likely hero image missing `priority` OR new
      `next/dynamic` component above the fold.
      Check: webpage/src/modules/hero/Hero.tsx
```

**Regression thresholds:**
- LCP: >500ms increase = REGRESSION
- FCP: >20% increase = WARNING
- CLS: >0.05 increase = WARNING
- JS bundle: >25% increase = REGRESSION

### Phase 7: Diagnosis + Fix Recommendations

For each regression, give a precise, file-level diagnosis:

```
LCP DIAGNOSIS
═════════════
Root cause: DatoImage in HeroSection missing `priority` prop.
File: webpage/src/modules/landing/components/HeroSection.tsx:47
Fix: Add `priority` to the <DatoImage> component.
Expected gain: ~1500ms LCP improvement on first load.

Secondary: vendor.chunk.js 520KB (+140KB) — check for new dependency added
in the same PR. Run: cd webpage && pnpm build --profile to identify.
```

### Phase 8: Save Report

Write to `.designeros/benchmark-reports/{date}-benchmark.md` and `.designeros/benchmark-reports/{date}-benchmark.json`.

## Important Rules

- **LCP first.** LCP is the primary metric for marketing pages. FID/INP matters for interactive pages. Always lead with LCP.
- **DatoCMS patterns first.** Missing `priority`, unoptimized images, and Lottie above the fold account for 80% of LCP regressions on this site. Check these before anything else.
- **Measure, don't guess.** Use actual `performance.getEntries()` data.
- **File-level precision.** Tell the developer the exact file and line, not "consider optimizing images."
- **Read-only.** Produce the report. Don't modify code unless explicitly asked.
