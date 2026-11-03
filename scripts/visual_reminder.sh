#!/usr/bin/env bash

# Pre-commit reminder: when staged source files can change how stories render, suggest running the
# visual tests locally so updated baselines can be committed with the change. Never blocks the commit.

cd "$(dirname "$0")/.." || exit 0

yellow=$'\e[1;33m'
end=$'\e[0m'

STAGED="$(git diff --cached --name-only 2>/dev/null)" || exit 0

# Baselines are already part of this commit, so the tests were run.
if echo "$STAGED" | grep -q '^test/visual/__screenshots__/'; then
    exit 0
fi

# Keep in sync with NON_RENDERING in scripts/visual_changes.sh.
NON_RENDERING='(\.md$|\.test\.[jt]sx?$|/__snapshots__/)'
RENDERING="$(echo "$STAGED" | grep '^src/' | grep -Ev "$NON_RENDERING")"

if [ -n "$RENDERING" ]; then
    echo "${yellow}Reminder: this commit changes source files that may affect how stories render.${end}"
    echo "${yellow}If it changes the UI, run \`yarn test:visual\` (needs Docker) and commit any updated${end}"
    echo "${yellow}screenshots in test/visual/__screenshots__/, or the CI visual tests will fail.${end}"
fi

exit 0
