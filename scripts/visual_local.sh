#!/usr/bin/env bash

# Runs the CI visual tests locally: builds Storybook, then runs `scripts/visual_tests.sh` in the same
# Playwright image CircleCI uses, because baselines only match screenshots rendered on Linux.
# Differing baselines are rewritten in `test/visual/__screenshots__/` for review in git.
# Set VISUAL_SKIP_BUILD=1 to reuse the current `storybook/`.

set -o nounset

cd "$(dirname "$0")/.." || exit 1

# Keep the tag in sync with @playwright/test and the `playwright-executor` in .circleci/config.yml.
IMAGE="mcr.microsoft.com/playwright:v1.63.0-noble"

if ! docker info >/dev/null 2>&1; then
    echo "Docker is not running. Visual tests need it to render screenshots the way CI does."
    exit 2
fi

if [ -z "${VISUAL_SKIP_BUILD:-}" ]; then
    # `build:i18n` rewrites the tracked i18n/en-US.properties; put it back if it was clean before.
    PROPERTIES_WERE_CLEAN=0
    git diff --quiet -- i18n/en-US.properties && PROPERTIES_WERE_CLEAN=1

    yarn build:i18n && yarn build:prod:storybook
    BUILD_STATUS=$?

    if [ "$PROPERTIES_WERE_CLEAN" = 1 ]; then
        git checkout -- i18n/en-US.properties
    fi
    if [ "$BUILD_STATUS" -ne 0 ]; then
        echo "Storybook build failed."
        exit 1
    fi
fi

# Run the image's native architecture: Chromium crashes under x86 emulation on Apple Silicon, and
# the screenshots are identical on arm64 and x86.
case "$(uname -m)" in
    arm64 | aarch64) PLATFORM=linux/arm64 ;;
    *) PLATFORM=linux/amd64 ;;
esac

# `--ulimit core=0` stops a crashing browser from writing multi-GB core dumps into the repo.
docker run --rm --platform "$PLATFORM" --ipc=host --ulimit core=0 -e CI=true -v "$PWD":/work -w /work "$IMAGE" scripts/visual_tests.sh
STATUS=$?

# The path printed inside the container is relative to /work, so print the host URL here.
REPORT="$PWD/reports/visual-artifacts/report/index.html"
if [ "$STATUS" -ne 0 ] && [ -f "$REPORT" ]; then
    echo
    echo "Review the changes at file://${REPORT}#?q=s:failed"
fi
exit "$STATUS"
