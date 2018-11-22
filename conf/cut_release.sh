#!/bin/bash

# Temp version
VERSION="XXX"

# Styling variables
red=$"\n\e[1;31m(✖) "
green=$"\n\e[1;32m(✔) "
blue=$"\n\e[1;34m(ℹ) "
end=$"\e[0m\n"

setup() {
    # Add release remote branch
    if git remote get-url release; then
        printf "${blue}Removing existing release remote branch...${end}"
        git remote remove release || return 1
        printf "${green}Removed existing release remote branch!${end}"
    fi
    printf "${blue}Adding release remote branch...${end}"
    git remote add release git@github.com:box/box-ui-elements.git || return 1
    printf "${green}Release remote branch added!${end}"

    # Checkout the release branch
    printf "${blue}Checking out or creating release branch...${end}"
    if ! git checkout release; then
        git checkout -b release || return 1
    fi
    printf "${green}Checked out release branch!${end}"

    # Fetch latest from the release remote
    printf "${blue}Fetching from remote release branch...${end}"
    git fetch release || return 1
    printf "${green}Fetched from remote release branch!${end}"

    if [ $HOTFIX == true ]; then
        printf "${blue}This is a hotfix release, ignoring reset to master...${end}"
    else
        # Reset hard to master branch on release remote
        printf "${blue}Resetting to remote release branch...${end}"
        git reset --hard release/master || return 1
        printf "${green}Reset to remote release branch!${end}"
    fi

    # Remove old local tags in case a build failed
    printf "${blue}Pruning tags...${end}"
    git fetch --prune release '+refs/tags/*:refs/tags/*' || return 1
    printf "${green}Pruned tags!${end}"

    # Clean untracked files
    printf "${blue}Updating remote release branch...${end}"
    git push release release --force --no-verify || return 1
    printf "${green}Updated remote release branch!${end}"

    # Clean untracked files
    printf "${blue}Cleaning untracked files...${end}"
    git clean -fd || return 1
    printf "${green}Cleaned untracked files!${end}"

    # Run install and build locales
    printf "${blue}Running setup...${end}"
    yarn setup || return 1
    printf "${green}Setup done!${end}"
}

lint_and_test() {
    # ESLint and Stylelint
    printf "${blue}Running linter...${end}"
    yarn lint || return 1
    printf "${green}Linting done!${end}"

    # Flow
    printf "${blue}Running flow...${end}"
    yarn flow check || return 1
    printf "${green}Flow check done!${end}"

    # Tests
    printf "${blue}Running tests...${end}"
    yarn test || return 1
    printf "${green}Tests done!${end}"
}

build_assets() {
    printf "${blue}Building assets...${end}"
    yarn build:npm || return 1
    printf "${green}Built assets!${end}"
}

push_to_npm() {
    printf "${blue}Publishing assets to npmjs...${end}"
    npm publish --access public || return 1
    printf "${green}Published npm!${end}"
}

build_examples() {
    printf "${blue}Building styleguide...${end}"
    yarn build:prod:examples || return 1
    printf "${green}Built styleguide!${end}"
}

push_to_gh_pages() {
    printf "${blue}Pushing styleguide to gh-pages...${end}"
    git branch -D gh-pages || return 1
    git checkout -b gh-pages || return 1
    rm -rf build
    cp -R styleguide/. ./ || return 1
    git add -A || return 1
    git commit --no-verify -am "build(examples): v$VERSION" || return 1
    git push release gh-pages --force --no-verify || return 1
    printf "${blue}Pushed styleguide to gh-pages...${end}"
}

check_untracked_files() {
    if [[ $(git status --porcelain 2>/dev/null| grep "^??") != "" ]] ; then
        printf "${red}Your branch has untracked files!${end}"
        return 1
    fi
}

check_uncommitted_files() {
    if [[ $(git status --porcelain 2>/dev/null| egrep "^(M| M)") != "" ]] ; then
        printf "${red}Your branch has uncommitted files!${end}"
        return 1
    fi
}

check_uncommitted_files_ignoring_package_json() {
    if [[ $(git status --porcelain | sed s/^...//) != "package.json" ]] ; then
        printf "${red}Your branch has uncommitted files!${end}"
        return 1
    fi
}

check_branch_dirty() {
    if [[ $(git diff --shortstat 2> /dev/null | tail -n1) != "" ]] ; then
        printf "${red}Your branch is dirty!${end}"
        return 1
    fi
}

push_new_release() {
    # Check branch being dirty
    check_branch_dirty || return 1

    # Check uncommitted files
    check_uncommitted_files || return 1

    # Check untracked files
    check_untracked_files || return 1

    # Setup
    if ! setup; then
        printf "${red}Failed setup!${end}"
        return 1
    fi

    # Linting and testing
    if ! lint_and_test; then
        printf "${red}Failed linting and testing!${end}"
        return 1
    fi

    # Check uncommitted files
    check_uncommitted_files || return 1

    # Check untracked files
    check_untracked_files || return 1

    # Run the release
    if ! yarn semantic-release --no-ci; then
        printf "${red}Failed semantic release!${end}"
        return 1
    fi

    # Get the latest version from uncommitted package.json
    VERSION=$(./node_modules/@box/frontend/shell/version.sh)

    # Make sure the version doesn't match the placeholder
    if [[ $VERSION == "0.0.0-semantically-released" ]] ; then
        printf "${red}No need to run a release!${end}"
        return 0
    fi

    # package.json should be the only updated and uncommitted file
    check_uncommitted_files_ignoring_package_json || return 1

    # Check untracked files
    check_untracked_files || return 1

    # Publish to npm
    if ! push_to_npm; then
        printf "${red}Failed pushing to npm!${end}"
        return 1
    fi

    # package.json should be the only updated and uncommitted file
    check_uncommitted_files_ignoring_package_json || return 1

    # Check untracked files
    check_untracked_files || return 1

    # Build examples
    if ! build_examples; then
        printf "${red}Failed building styleguide!${end}"
        return 1
    fi

    # Publish gh-pages
    if ! push_to_gh_pages; then
        printf "${red}Failed pushing styleguide to gh-pages!${end}"
        return 1
    fi

    # Check uncommitted files
    check_uncommitted_files || return 1

    # Check untracked files
    check_untracked_files || return 1
}
