#!/usr/bin/env bash

# Runs the Playwright visual regression tests against the built Storybook (`storybook/`).
# When screenshots differ from the committed baselines, the failed tests are re-run with
# `--update-snapshots=changed` and only the rewritten baselines are packed into
# `$VISUAL_ARTIFACTS_DIR/visual-baselines.tgz`. Extract it at the repo root to apply them.

set -o nounset

cd "$(dirname "$0")/.." || exit 1

CONFIG=test/visual/playwright.config.ts
SCREENSHOTS_DIR=test/visual/__screenshots__
ARTIFACTS_DIR="${VISUAL_ARTIFACTS_DIR:-reports/visual-artifacts}"
CHANGED_LIST="$ARTIFACTS_DIR/changed-baselines.txt"

mkdir -p "$ARTIFACTS_DIR"
# Baselines written by either run below are newer than this marker, including missing ones.
MARKER="$(mktemp)"

if npx playwright test -c "$CONFIG"; then
    exit 0
fi

# The update run below clears the output directory, so keep the diff images and report first.
cp -R reports/visual "$ARTIFACTS_DIR/report" 2>/dev/null
cp -R reports/visual-results "$ARTIFACTS_DIR/results" 2>/dev/null

echo "Visual differences found. Regenerating the failed screenshots..."
npx playwright test -c "$CONFIG" --last-failed --update-snapshots=changed --reporter=list

find "$SCREENSHOTS_DIR" -name '*.png' -newer "$MARKER" | sort > "$CHANGED_LIST"

if [ -n "${CIRCLE_WORKFLOW_JOB_ID:-}" ]; then
    ARTIFACTS_URL="https://output.circle-artifacts.com/output/job/${CIRCLE_WORKFLOW_JOB_ID}/artifacts/${CIRCLE_NODE_INDEX:-0}/visual"
else
    ARTIFACTS_URL="$ARTIFACTS_DIR"
fi
PR_NUMBER="${CIRCLE_PR_NUMBER:-${CIRCLE_PULL_REQUEST##*/}}"

echo
echo "Review the changes at ${ARTIFACTS_URL}/report/index.html#?q=s:failed"
echo

if [ -s "$CHANGED_LIST" ]; then
    tar -czf "$ARTIFACTS_DIR/visual-baselines.tgz" -T "$CHANGED_LIST"
    echo "Regenerated baselines:"
    sed 's/^/  /' "$CHANGED_LIST"
    echo
    echo "If these changes are intended, apply them from the repo root and commit the PNGs:"
    if [ -n "$PR_NUMBER" ]; then
        echo "  yarn test:visual:download ${PR_NUMBER}"
    fi
    echo "  curl -sL ${ARTIFACTS_URL}/visual-baselines.tgz | tar -xz"
else
    echo "No baselines were regenerated; the failure is not a screenshot difference. See the log above."
fi

exit 1
