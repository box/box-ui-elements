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
        move_reports
    else
        echo "----------------------------------------------------"
        echo "Failed testing!"
        echo "----------------------------------------------------"
        move_reports
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
    if git push origin master --tags --no-verify; then
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

move_reports() {
    echo "--------------------------------------------------------------------------"
    echo "Moving test reports to ./reports/cobertura.xml and ./reports/junit.xml"
    echo "--------------------------------------------------------------------------"
    mv ./reports/coverage/cobertura/*/cobertura-coverage.xml ./reports/cobertura.xml;
    mv ./reports/coverage/junit/*/junit.xml ./reports/junit.xml;
}

# Check out latest code from git, build assets, increment version, and push t
push_new_release() {
    git checkout master || exit 1
    git fetch origin || exit 1
    git reset --hard origin/master || exit 1
    # Remove old local tags in case a build failed
    git fetch --prune origin '+refs/tags/*:refs/tags/*' || exit 1
    git clean -fdX || exit 1

    # Install node modules
    if ! install_dependencies; then
        echo "----------------------------------------------------"
        echo "Error in install_dependencies!"
        echo "----------------------------------------------------"
        exit 1
    fi

    # Double check that we have the latest code... just in case yarn install took forever.
    # i.e. Translation commits have been known to sneak in.
    git fetch origin || exit 1
    git diff --quiet origin/master || git reset --hard origin/master || exit 1


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
