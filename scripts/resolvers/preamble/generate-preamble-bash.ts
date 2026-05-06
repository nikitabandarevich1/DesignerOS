import type { TemplateContext } from '../types';
import { getHostConfig } from '../../../hosts/index';

export function generatePreambleBash(ctx: TemplateContext): string {
  const hostConfig = getHostConfig(ctx.host);
  const runtimeRoot = hostConfig.usesEnvVars
    ? `_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
DESIGNEROS_ROOT="$HOME/${hostConfig.globalRoot}"
[ -n "$_ROOT" ] && [ -d "$_ROOT/${ctx.paths.localSkillRoot}" ] && DESIGNEROS_ROOT="$_ROOT/${ctx.paths.localSkillRoot}"
DESIGNEROS_BIN="$DESIGNEROS_ROOT/bin"
DESIGNEROS_BROWSE="$DESIGNEROS_ROOT/browse/dist"
DESIGNEROS_DESIGN="$DESIGNEROS_ROOT/design/dist"
`
    : '';

  return `## Preamble (run first)

\`\`\`bash
${runtimeRoot}mkdir -p ~/.designeros/sessions
touch ~/.designeros/sessions/"$PPID"
_SESSIONS=$(find ~/.designeros/sessions -mmin -120 -type f 2>/dev/null | wc -l | tr -d ' ')
find ~/.designeros/sessions -mmin +120 -type f -exec rm {} + 2>/dev/null || true
_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
echo "BRANCH: $_BRANCH"
source <(${ctx.paths.binDir}/gstack-repo-mode 2>/dev/null) || true
REPO_MODE=\${REPO_MODE:-unknown}
echo "REPO_MODE: $REPO_MODE"
_SESSION_ID="$$-$(date +%s)"
_EXPLAIN_LEVEL=$(${ctx.paths.binDir}/gstack-config get explain_level 2>/dev/null || echo "default")
if [ "$_EXPLAIN_LEVEL" != "default" ] && [ "$_EXPLAIN_LEVEL" != "terse" ]; then _EXPLAIN_LEVEL="default"; fi
echo "EXPLAIN_LEVEL: $_EXPLAIN_LEVEL"
_QUESTION_TUNING=$(${ctx.paths.binDir}/gstack-config get question_tuning 2>/dev/null || echo "false")
echo "QUESTION_TUNING: $_QUESTION_TUNING"
eval "$(${ctx.paths.binDir}/gstack-slug 2>/dev/null)" 2>/dev/null || true
_LEARN_FILE="\${DESIGNEROS_HOME:-$HOME/.designeros}/projects/\${SLUG:-unknown}/learnings.jsonl"
if [ -f "$_LEARN_FILE" ]; then
  _LEARN_COUNT=$(wc -l < "$_LEARN_FILE" 2>/dev/null | tr -d ' ')
  echo "LEARNINGS: $_LEARN_COUNT entries loaded"
  if [ "$_LEARN_COUNT" -gt 5 ] 2>/dev/null; then
    ${ctx.paths.binDir}/gstack-learnings-search --limit 3 2>/dev/null || true
  fi
else
  echo "LEARNINGS: 0"
fi
[ -n "$OPENCLAW_SESSION" ] && echo "SPAWNED_SESSION: true" || true
echo "MODEL_OVERLAY: ${ctx.model ?? 'none'}"
_CHECKPOINT_MODE=$(${ctx.paths.binDir}/gstack-config get checkpoint_mode 2>/dev/null || echo "explicit")
_CHECKPOINT_PUSH=$(${ctx.paths.binDir}/gstack-config get checkpoint_push 2>/dev/null || echo "false")
echo "CHECKPOINT_MODE: $_CHECKPOINT_MODE"
echo "CHECKPOINT_PUSH: $_CHECKPOINT_PUSH"
\`\`\``;
}
