#!/bin/bash

source ./build/add_remote.sh
source ./build/setup.sh
source ./build/lint_test.sh

push_new_release() {
    if [[ $(git diff --shortstat 2> /dev/null | tail -n1) != "" ]] ; then
        echo "----------------------------------------------------"
        echo "Your branch is dirty!"
        echo "----------------------------------------------------"
        exit 1
    fi

    if ! add_remote; then
        echo "----------------------------------------------------"
        echo "Error in add_remote!"
        echo "----------------------------------------------------"
        exit 1
    fi

    # Checkout the release branch
    if ! git checkout release; then
        git checkout -b release || exit 1
    fi

    # Fetch latest from the release remote
    git fetch release || exit 1

    # Reset hard to release branch on release remote
    git reset --hard release/release || exit 1

    # Remove old local tags in case a build failed
    git fetch --prune release '+refs/tags/*:refs/tags/*' || exit 1

    # Clean untracked files
    git clean -fd || exit 1

    # Run setup
    if ! setup; then
        echo "----------------------------------------------------"
        echo "Error in setup!"
        echo "----------------------------------------------------"
        exit 1
    fi

    # Double check that we have the latest code... just in case yarn install took forever.
    # i.e. Translation commits have been known to sneak in.
    git fetch release || exit 1
    git diff --quiet release/release || git reset --hard release/release || exit 1

    # Do testing and linting
    if ! lint_and_test; then
        echo "----------------------------------------------------"
        echo "Error in lint_and_test!"
        echo "----------------------------------------------------"
        exit 1
    fi

    if [[ $(git status --porcelain 2>/dev/null| grep "^??") != "" ]] ; then
        echo "----------------------------------------------------"
        echo "Your branch has untracked files!"
        echo "----------------------------------------------------"
        exit 1
    fi

    if [[ $(git status --porcelain 2>/dev/null| egrep "^(M| M)") != "" ]] ; then
        echo "----------------------------------------------------"
        echo "Your branch has uncommitted files!"
        echo "----------------------------------------------------"
        exit 1
    fi

    # Run the release
    if ! yarn run semantic-release --no-ci; then
        echo "----------------------------------------------------"
        echo "Error in increment_version!"
        echo "----------------------------------------------------"
        exit 1
    fi
}

# Execute this entire script
if ! push_new_release; then
    echo "----------------------------------------------------"
    echo "Error: failure in push_new_release!"
    echo "----------------------------------------------------"
    exit 1
fi
