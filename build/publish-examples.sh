#!/bin/bash

# Temp version
VERSION="XXX"

clean_assets() {
    echo "----------------------------------------------------"
    echo "Running clean for version" $VERSION
    echo "----------------------------------------------------"
    if yarn clean-styleguide; then
        echo "----------------------------------------------------"
        echo "Done cleaning for version" $VERSION
        echo "----------------------------------------------------"
    else
        echo "----------------------------------------------------"
        echo "Failed cleaning!"
        echo "----------------------------------------------------"
        exit 1;
    fi
}

pre_build() {
    echo "-------------------------------------------------------------"
    echo "Starting install, clean and pre build for version" $VERSION
    echo "----------------------------------------------------"
    if yarn pre-build; then
        echo "----------------------------------------------------"
        echo "Pre build complete for version" $VERSION
        echo "----------------------------------------------------"
    else
        echo "----------------------------------------------------"
        echo "Failed to pre build!"
        echo "----------------------------------------------------"
        exit 1;
    fi
}

build_examples() {
    echo "----------------------------------------------------"
    echo "Starting examples build for version" $VERSION
    echo "----------------------------------------------------"
    if yarn styleguide-static; then
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
    git fetch origin || exit 1
    if ! git checkout gh-pages; then
        git checkout -b gh-pages origin/gh-pages || exit 1
    fi
    git rebase origin/gh-pages || exit 1
    cp -R styleguide/. ./ || exit 1
    git add -A || exit 1
    git commit -am $VERSION || exit 1
    git push || exit 1
}

add_remote() {
    # Add the release remote if it is not present
    if git remote get-url release; then
        git remote remove release || return 1
    fi
    git remote add release git@github.com:box/box-ui-elements.git || return 1
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

    git checkout master || exit 1
    git fetch release || exit 1
    git reset --hard release/master || exit 1
    # Remove old local tags in case a build failed
    git fetch --prune release '+refs/tags/*:refs/tags/*' || exit 1
    git clean -fd || exit 1

    VERSION=$(./build/current_version.sh)

    if [[ $(git status --porcelain 2>/dev/null| grep "^??") != "" ]] ; then
        echo "----------------------------------------------------"
        echo "Your branch has untracked files!"
        echo "----------------------------------------------------"
        exit 1
    fi

    if [[ $(git status --porcelain 2>/dev/null| egrep "^(M| M)") != "" ]] ; then
        echo "----------------------------------------------------"
        echo "Your branch has uncommited files!"
        echo "----------------------------------------------------"
        exit 1
    fi

    echo "----------------------------------------------------"
    echo "Checking out version" $VERSION
    echo "----------------------------------------------------"
    # Check out the version we want to build (version tags are prefixed with a v)
    git checkout v$VERSION || exit 1

    # Do testing and linting
    if ! clean_assets; then
        echo "----------------------------------------------------"
        echo "Error in clean_assets!"
        echo "----------------------------------------------------"
        exit 1
    fi

    # Do pre build
    if ! pre_build; then
        echo "----------------------------------------------------"
        echo "Error in pre_build!"
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
echo "Checking out back to master"
echo "----------------------------------------------------"
git checkout master || exit 1
