#!/bin/bash

# Temp version
VERSION="XXX"


# Major, minor, or patch release
major_release=false
minor_release=false
patch_release=false


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
    echo "Running linter for version" $VERSION
    echo "----------------------------------------------------"
    if yarn run lint; then
        echo "----------------------------------------------------"
        echo "Done linting for version" $VERSION
        echo "----------------------------------------------------"
    else
        echo "----------------------------------------------------"
        echo "Failed linting!"
        echo "----------------------------------------------------"
        exit 1;
    fi


    echo "----------------------------------------------------"
    echo "Running tests for version" $VERSION
    echo "----------------------------------------------------"
    if yarn run test; then
        echo "----------------------------------------------------"
        echo "Done testing for version" $VERSION
        echo "----------------------------------------------------"
    else
        echo "----------------------------------------------------"
        echo "Failed testing!"
        echo "----------------------------------------------------"
        exit 1;
    fi
}

generate_changelog() {
    echo "----------------------------------------------------"
    echo "Updating CHANGELOG.md for version" $VERSION
    echo "----------------------------------------------------"
    if yarn run changelog; then
        echo "----------------------------------------------------"
        echo "Updated CHANGELOG.md for version" $VERSION
        echo "----------------------------------------------------"
    else
        echo "----------------------------------------------------"
        echo "Failed to update change log!"
        echo "----------------------------------------------------"
        exit 1;
    fi
}

increment_version() {
    if $major_release; then
        echo "----------------------------------------------------"
        echo "Bumping major version..."
        echo "----------------------------------------------------"
        npm --no-git-tag-version version major
    elif $minor_release; then
        echo "----------------------------------------------------"
        echo "Bumping minor version..."
        echo "----------------------------------------------------"
        npm --no-git-tag-version version minor
    elif $patch_release; then
        echo "----------------------------------------------------"
        echo "Bumping patch version..."
        echo "----------------------------------------------------"
        npm --no-git-tag-version version patch
    fi

    # The current version being built
    VERSION=$(./build/current_version.sh)
}

commit_and_tag() {
    echo "----------------------------------------------------"
    echo "Creating commit for version and changelog"
    echo "----------------------------------------------------"

    git commit -am "Release: $VERSION"

    echo "----------------------------------------------------"
    echo "Tagging commit v"$VERSION
    echo "----------------------------------------------------"

    git tag -a v$VERSION -m $VERSION
}

push_to_github() {
    # Push to Github including tags
    if git push release master --tags --no-verify; then
        echo "----------------------------------------------------"
        echo "Pushed version" $VERSION "to git successfully"
        echo "----------------------------------------------------"
    else
        echo "----------------------------------------------------"
        echo "Error while pushing version" $VERSION "to git"
        echo "----------------------------------------------------"
        exit 1
    fi
}

tag_release_on_github() {
    if yarn run github-release; then
        echo "----------------------------------------------------------------------"
        echo "Pushing new GitHub release succuessfully"
        echo "----------------------------------------------------------------------"
    else
        echo "----------------------------------------------------------------------"
        echo "Error pushing new GitHub release"
        echo "----------------------------------------------------------------------"
        exit 1
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

    # Must bump version before changelog generation (should not create tag)
    if ! increment_version; then
        echo "----------------------------------------------------"
        echo "Error in increment_version!"
        echo "----------------------------------------------------"
        exit 1
    fi

    if ! generate_changelog; then
        echo "----------------------------------------------------"
        echo "Error in generate_changelog!"
        echo "----------------------------------------------------"
        exit 1
    fi

    # Tag versions
    if ! commit_and_tag; then
        echo "----------------------------------------------------"
        echo "Error in commit_and_tag!"
        echo "----------------------------------------------------"
        exit 1
    fi

    # Push to github
    if ! push_to_github; then
        echo "----------------------------------------------------"
        echo "Error in push_to_github!"
        echo "----------------------------------------------------"
        exit 1
    fi

    # Push GitHub release
    if ! tag_release_on_github; then
        echo "----------------------------------------------------"
        echo "Error in tag_release_on_github!"
        echo "----------------------------------------------------"
        exit 1
    fi
}

# Check if we are doing major, minor, or patch release
while getopts "mnp" opt; do
    case "$opt" in
        m )
            major_release=true ;;
        n )
            minor_release=true ;;
        p )
            patch_release=true ;;
    esac
done

# Execute this entire script
if ! push_new_release; then
    echo "----------------------------------------------------"
    echo "Error: failure in push_new_release!"
    echo "----------------------------------------------------"
    exit 1
fi
