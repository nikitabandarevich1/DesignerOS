import type { TemplateContext } from '../types';

export function generatePlanModeInfo(_ctx: TemplateContext): string {
  return `## Plan Mode Safe Operations

In plan mode, allowed because they inform the plan: \`$B\`, \`$D\`, writes to \`~/.designeros/\`, writes to the plan file, and \`open\` for generated artifacts.

## Skill Invocation During Plan Mode

If the user invokes a skill in plan mode, the skill takes precedence over generic plan mode behavior. **Treat the skill file as executable instructions, not reference.** Follow it step by step starting from Step 0; the first AskUserQuestion is the workflow entering plan mode, not a violation of it. AskUserQuestion (any variant — \`mcp__*__AskUserQuestion\` or native; see "AskUserQuestion Format → Tool resolution") satisfies plan mode's end-of-turn requirement. If no variant is callable, fall back to writing the decision brief into the plan file as a \`## Decisions to confirm\` section + ExitPlanMode — never silently auto-decide. At a STOP point, stop immediately. Do not continue the workflow or call ExitPlanMode there. Commands marked "PLAN MODE EXCEPTION — ALWAYS RUN" execute. Call ExitPlanMode only after the skill workflow completes, or if the user tells you to cancel the skill or leave plan mode.`;
}

export function generateCompletionStatus(ctx: TemplateContext): string {
  return `## Completion Status Protocol

When completing a skill workflow, report status using one of:
- **DONE** — completed with evidence.
- **DONE_WITH_CONCERNS** — completed, but list concerns.
- **BLOCKED** — cannot proceed; state blocker and what was tried.
- **NEEDS_CONTEXT** — missing info; state exactly what is needed.

Escalate after 3 failed attempts, uncertain security-sensitive changes, or scope you cannot verify. Format: \`STATUS\`, \`REASON\`, \`ATTEMPTED\`, \`RECOMMENDATION\`.

## Operational Self-Improvement

Before completing, if you discovered a durable project quirk or command fix that would save 5+ minutes next time, log it:

\`\`\`bash
${ctx.paths.binDir}/gstack-learnings-log '{"skill":"SKILL_NAME","type":"operational","key":"SHORT_KEY","insight":"DESCRIPTION","confidence":N,"source":"observed"}'
\`\`\`

Do not log obvious facts or one-time transient errors.

## Session Timeline (run last)

After workflow completion, log the timeline event. Use skill \`name:\` from frontmatter. OUTCOME is success/error/abort/unknown.

**PLAN MODE EXCEPTION — ALWAYS RUN.**

\`\`\`bash
_TEL_END=$(date +%s)
_TEL_DUR=$(( _TEL_END - ${ctx.paths.binDir.includes('designeros') ? '_TEL_START' : '_TEL_START'} ))
# Session timeline: record skill completion (local-only)
${ctx.paths.binDir}/gstack-timeline-log '{"skill":"SKILL_NAME","event":"completed","branch":"'$(git branch --show-current 2>/dev/null || echo unknown)'","outcome":"OUTCOME","duration_s":"'"$_TEL_DUR"'","session":"'"$_SESSION_ID"'"}' 2>/dev/null || true
\`\`\`

Replace \`SKILL_NAME\` and \`OUTCOME\` before running.`;
}
