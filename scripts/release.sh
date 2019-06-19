#!/bin/bash

source ./scripts/cut_release.sh

# Skip git hooks
HUSKY_SKIP_HOOKS=1

# Execute this entire script
if ! push_new_release; then
    printf "${red}Failed creating a new release!${end}"
    printf "${red}Might still be on release branch!${end}"

    # Enable git hooks
    HUSKY_SKIP_HOOKS=
    exit 1
fi

# Enable git hooks
HUSKY_SKIP_HOOKS=

printf "${blue}Checking back out to master...${end}"
git checkout master || exit 1
