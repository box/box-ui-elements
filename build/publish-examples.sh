#!/bin/bash

source ./build/add_remote.sh
source ./build/setup.sh

# Temp version
VERSION="XXX"

build_examples() {
    echo "----------------------------------------------------"
    echo "Starting examples build for version" $VERSION
    echo "----------------------------------------------------"
    if yarn build:prod:examples; then
        echo "----------------------------------------------------"
        echo "Built examples for version" $VERSION
        echo "----------------------------------------------------"
    else
        echo "----------------------------------------------------"
        echo "Failed to build examples assets!"
        echo "----------------------------------------------------"
        exit 1;
    fi
}

push_to_gh_pages() {
    echo "---------------------------------------------------------"
    echo "Running copying styleguide over to gh-pages" $VERSION
    echo "---------------------------------------------------------"
    git fetch release || exit 1
    if ! git checkout gh-pages; then
        git checkout -b gh-pages || exit 1
    fi
    git rebase release/gh-pages || exit 1
    cp -R styleguide/. ./ || exit 1
    git add -A || exit 1
    git commit -am "build(examples): v$VERSION" || exit 1
    git push release gh-pages --no-verify || exit 1
}

publish_examples() {
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

    # Build examples
    if ! build_examples; then
        echo "----------------------------------------------------"
        echo "Error in build_assets!"
        echo "----------------------------------------------------"
        exit 1
    fi

    # Publish gh-pages
    if ! push_to_gh_pages; then
        echo "----------------------------------------------------"
        echo "Error in push_to_gh_pages!"
        echo "----------------------------------------------------"
        exit 1
    fi
}

# Execute this entire script
if ! publish_examples; then
    echo "----------------------------------------------------"
    echo "Error: failure in publish_examples!"
    echo "----------------------------------------------------"
    exit 1
fi

echo "----------------------------------------------------"
echo "Checking out back to release"
echo "----------------------------------------------------"
git checkout release || exit 1
