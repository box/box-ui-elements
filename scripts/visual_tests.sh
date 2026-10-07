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

if [ -s "$CHANGED_LIST" ]; then
    tar -czf "$ARTIFACTS_DIR/visual-baselines.tgz" -T "$CHANGED_LIST"
    echo
    echo "Updated baselines:"
    cat "$CHANGED_LIST"
    echo
    echo "If these changes are intended, download visual/visual-baselines.tgz from this job's"
    echo "Artifacts tab, run \`tar -xzf visual-baselines.tgz\` at the repo root, and commit the PNGs."
else
    echo "No baselines were regenerated; the failure is not a screenshot difference. See the log above."
fi

exit 1
