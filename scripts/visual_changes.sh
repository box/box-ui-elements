#!/usr/bin/env bash

# Exits 1 when the branch only changes files that cannot affect how a story renders, so CI can
# skip the visual tests. Anything uncertain (master, no merge base, git errors) exits 0 to run them.

cd "$(dirname "$0")/.." || exit 0

BRANCH="${CIRCLE_BRANCH:-$(git rev-parse --abbrev-ref HEAD)}"
if [ "$BRANCH" = "master" ]; then
    echo "On master: running visual tests."
    exit 0
fi

git fetch --quiet origin master 2>/dev/null
if ! BASE="$(git merge-base origin/master HEAD 2>/dev/null)"; then
    echo "No merge base with origin/master: running visual tests."
    exit 0
fi
if ! CHANGED="$(git diff --name-only "$BASE" HEAD)"; then
    echo "Could not list changed files: running visual tests."
    exit 0
fi

# Docs, repo metadata, Cypress specs, and Jest tests never reach the Storybook build.
NON_RENDERING='(\.md$|^\.github/|^\.mergify\.yml$|^CODEOWNERS$|^LICENSE|^test/integration/|\.test\.[jt]sx?$|/__snapshots__/)'
RENDERING="$(echo "$CHANGED" | grep -Ev "$NON_RENDERING")"

if [ -n "$RENDERING" ]; then
    echo "Files that can affect rendering changed since $(git rev-parse --short "$BASE"):"
    echo "$RENDERING" | head -20 | sed 's/^/  /'
    exit 0
fi

echo "Only docs, metadata, or tests changed since $(git rev-parse --short "$BASE"): skipping visual tests."
exit 1
