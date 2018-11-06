#!/bin/bash

install_dependencies() {
    echo "--------------------------------------------------------"
    echo "Installing all package dependencies"
    echo "--------------------------------------------------------"
    if yarn install; then
        echo "----------------------------------------------------"
        echo "Installed dependencies successfully."
        echo "----------------------------------------------------"
    else
        echo "----------------------------------------------------"
        echo "Error: Failed to run 'yarn install'!"
        echo "----------------------------------------------------"
        exit 1;
    fi

    echo "----------------------------------------------"
    echo "Check for known vulnerabilities"
    echo "----------------------------------------------"
    if yarn run nsp; then
        echo "----------------------------------------------------"
        echo "No known vulnerabilities found"
        echo "----------------------------------------------------"
    else
        echo "----------------------------------------------------"
        echo "Vulnerabilities found!"
        echo "----------------------------------------------------"
        exit 1;
    fi
}

lint_and_test() {
    echo "----------------------------------------------------"
    echo "Running linter"
    echo "----------------------------------------------------"
    if yarn run lint; then
        echo "----------------------------------------------------"
        echo "Done linting"
        echo "----------------------------------------------------"
    else
        echo "----------------------------------------------------"
        echo "Failed linting!"
        echo "----------------------------------------------------"
        exit 1;
    fi


    echo "----------------------------------------------------"
    echo "Running tests"
    echo "----------------------------------------------------"
    if yarn run test; then
        echo "----------------------------------------------------"
        echo "Done testing"
        echo "----------------------------------------------------"
    else
        echo "----------------------------------------------------"
        echo "Failed testing!"
        echo "----------------------------------------------------"
        exit 1;
    fi
}

add_remote() {
    # Add the release remote if it is not present
    if git remote get-url release; then
        git remote remove release || return 1
    fi
    git remote add release git@github.com:box/box-ui-elements.git || return 1
}

# Check out latest code from git, build assets, increment version, and push t
push_new_release() {
    if ! add_remote; then
        echo "----------------------------------------------------"
        echo "Error in add_remote!"
        echo "----------------------------------------------------"
        exit 1
    fi

    if $patch_release; then
        read -p "Patch releases will push your current branch as is. Are you sure you want to continue? [y/N] " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "Starting patch release"
        else
            exit 1
        fi
    fi

    if ! $patch_release; then
        # reset to latest master if its a major / minor release
        git checkout master || exit 1
        git fetch release || exit 1
        git reset --hard release/master || exit 1
    fi

    # Remove old local tags in case a build failed
    git fetch --prune release '+refs/tags/*:refs/tags/*' || exit 1
    git clean -fd || exit 1

    # Install node modules
    if ! install_dependencies; then
        echo "----------------------------------------------------"
        echo "Error in install_dependencies!"
        echo "----------------------------------------------------"
        exit 1
    fi

    if ! $patch_release; then
        # Double check that we have the latest code... just in case yarn install took forever.
        # i.e. Translation commits have been known to sneak in.
        git fetch release || exit 1
        git diff --quiet release/master || git reset --hard release/master || exit 1
    fi

    # Do testing and linting
    if ! lint_and_test; then
        echo "----------------------------------------------------"
        echo "Error in lint_and_test!"
        echo "----------------------------------------------------"
        exit 1
    fi

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
