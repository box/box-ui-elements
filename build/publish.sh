#!/bin/bash

source ./build/add_remote.sh
source ./build/setup.sh
source ./build/lint_test.sh

# Temp version
VERSION="XXX"

build_assets() {
    echo "----------------------------------------------------"
    echo "Starting npm build for version" $VERSION
    echo "----------------------------------------------------"
    if yarn build:npm; then
        echo "----------------------------------------------------"
        echo "Built npm assets for version" $VERSION
        echo "----------------------------------------------------"
    else
        echo "----------------------------------------------------"
        echo "Failed to npm production assets!"
        echo "----------------------------------------------------"
        exit 1;
    fi
}

push_to_npm() {
    echo "---------------------------------------------------------"
    echo "Running npm publish for version" $VERSION
    echo "---------------------------------------------------------"
    if npm publish --access public; then
        echo "--------------------------------------------------------"
        echo "Published version" $VERSION
        echo "--------------------------------------------------------"
    else
        echo "----------------------------------------------------"
        echo "Error publishing to npm registry!"
        echo "----------------------------------------------------"
        exit 1;
    fi
}

publish_to_npm() {
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

    VERSION=$(./node_modules/@box/frontend/shell/version.sh)

    echo "----------------------------------------------------"
    echo "Checking out version" $VERSION
    echo "----------------------------------------------------"
    # Check out the version we want to build (version tags are prefixed with a v)
    git checkout v$VERSION || exit 1

    # Run setup
    if ! setup; then
        echo "----------------------------------------------------"
        echo "Error in setup!"
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

    # NPM build
    if ! build_assets; then
        echo "----------------------------------------------------"
        echo "Error in build_assets!"
        echo "----------------------------------------------------"
        exit 1
    fi

    # Publish
    if ! push_to_npm; then
        echo "----------------------------------------------------"
        echo "Error in push_to_npm!"
        echo "----------------------------------------------------"
        exit 1
    fi
}

# Execute this entire script
if ! publish_to_npm; then
    echo "----------------------------------------------------"
    echo "Error: failure in publish_to_npm!"
    echo "----------------------------------------------------"
    exit 1
fi

echo "----------------------------------------------------"
echo "Checking out back to release"
echo "----------------------------------------------------"
git checkout release || exit 1
