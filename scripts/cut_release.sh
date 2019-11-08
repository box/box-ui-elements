#!/bin/bash

# Temp version
VERSION="XXX"
DISTTAG="XXX"

# Styling variables
red=$"\n\e[1;31m(✖) "
green=$"\n\e[1;32m(✔) "
blue=$"\n\e[1;34m(ℹ) "
end=$"\e[0m\n"

# While running yarn, the registry changes to registry.yarnpkg.com which is a mirror to the public NPM registry
YARN_PUBLIC_REGISTRY_REGEX="^https://registry\.yarnpkg\.com/$"
NPM_PUBLIC_REGISTRY_REGEX="^https://registry\.npmjs\.org/$"
NPM_PUBLIC_REGISTRY="https://registry.npmjs.org"

check_release_scripts_changed() {
    if [[ $(git diff --shortstat HEAD..release/master scripts  2> /dev/null | tail -n1) != "" ]] ; then
        printf "${red}Build scripts have changed, aborting! Run release command from master.${end}"
        return 1
    fi
}

setup_remote() {
    # Adds the release remote branch by nuking existing if any.
    # We add this because we don't want to assume what people call their
    # origin or what people call their upstream.
    if git remote get-url release; then
        printf "${blue}Removing existing release remote branch...${end}"
        git remote remove release || return 1
        printf "${green}Removed existing release remote branch!${end}"
    fi
    printf "${blue}Adding release remote branch...${end}"
    git remote add release "https://$GITHUB_TOKEN@github.com/box/box-ui-elements.git" || return 1
    printf "${green}Release remote branch added!${end}"
}

fetch_and_prune_tags() {
    # Fetch from release remote and prune tags
    printf "${blue}Fetching release remote and pruning tags...${end}"
    git fetch release || return 1
    git fetch release --prune 'refs/tags/*:refs/tags/*' || return 1
    printf "${green}Fetched and pruned tags!${end}"
}

checkout_branch() {
    printf "${blue}Determining dist-tag and checking out ${BRANCH}...${end}"
    if [[ "$HOTFIX" == true ]] && [[ "$BRANCH" != "" ]] && [[ "$BRANCH" != "master" ]] && [[ "$BRANCH" != "release" ]]; then
        printf "${blue}This is a hotfix release, using latest dist-tag...${end}"
        DISTTAG='latest'
        printf "${blue}Checking out ${BRANCH}...${end}"
        git checkout $BRANCH || return 1
        GIT_BRANCH=$BRANCH
    elif [[ "$HOTFIX" != true ]] && [[ "$BRANCH" == "master" ]]; then
        printf "${blue}This is a master branch release, using beta dist-tag...${end}"
        DISTTAG='beta'
        printf "${blue}Checking out master...${end}"
        git checkout master || return 1
        GIT_BRANCH=master
        printf "${blue}Resetting to remote release/master...${end}"
        git reset --hard release/master || return 1
    elif [[ "$HOTFIX" != true ]] && [[ "$BRANCH" == "release" ]]; then
        printf "${blue}This is a stable branch release, using latest dist-tag...${end}"
        DISTTAG='latest'
        if [[ $(git branch | grep -w "release") != "" ]] ; then
            git branch -D release || return 1
            printf "${green}Deleted stale release branch!${end}"
        fi
        printf "${blue}Checking out release...${end}"
        git checkout -b release || return 1
        GIT_BRANCH=release
        printf "${blue}Resetting to remote release/master...${end}"
        git reset --hard release/master || return 1
        printf "${blue}Updating remote release branch with latest from master...${end}"
        git push release release --force --no-verify || return 1
    fi

    if [[ "$DISTTAG" == "XXX" ]]; then
        printf "${red}Could not determine a dist-tag based on the provided branch=${BRANCH}${end}"
        if [[ "$HOTFIX" == true ]]; then
            printf "${red}For hotfix you must pass in the git tag branch, eg: BRANCH=vX.X.X yarn release:hotfix${end}"
        else
            printf "${red}Branch can only be master or release${end}"
        fi
        return 1
    else
        printf "${green}${BRANCH} checkout complete and dist-tag determined!${end}"
    fi
}

setup() {
    # Setup remote git url
    setup_remote || return 1

    # Fetch and prune
    fetch_and_prune_tags || return 1

    # Only proceed if release scripts haven't changed
    # Master branch should have latest build scripts
    printf "${blue}Checking out master...${end}"
    git checkout master || return 1
    check_release_scripts_changed || return 1

    # Checkout the branch from which we want to release
    checkout_branch || return 1

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
    printf "${blue}Building locales...${end}"
    yarn build:i18n || return 1
    printf "${green}Built locales!${end}"
}

push_to_npm() {
    printf "${blue}Publishing assets to npmjs...${end}"
    npm publish --access public --tag "$DISTTAG" || return 1
    printf "${green}Published npm using dist-tag=${DISTTAG}!${end}"
}

build_examples() {
    printf "${blue}Building styleguide...${end}"
    yarn build:prod:examples || return 1
    printf "${green}Built styleguide!${end}"
}

push_to_gh_pages() {
    printf "${blue}Pushing styleguide to gh-pages...${end}"
    if [[ $(git branch | grep -w "gh-pages") != "" ]] ; then
        git branch -D gh-pages || return 1
        printf "${green}Deleted existing gh-pages branch!${end}"
    fi
    git checkout -b gh-pages || return 1
    rm -rf build
    cp -R styleguide/. ./ || return 1
    cp examples/gitignore .gitignore || return 1
    git rm -rf --cached . || return 1
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

check_npm_registry() {
    if [[ ! $(npm config get registry) =~ (${YARN_PUBLIC_REGISTRY_REGEX}|${NPM_PUBLIC_REGISTRY_REGEX}) ]] ; then
        printf "${red}Not pointing at the right npm registry! Make sure ~/.npmrc points to ${NPM_PUBLIC_REGISTRY}${end}"
        return 1
    fi
}

check_npm_login() {
    if [[ ! $(npm whoami --registry ${NPM_PUBLIC_REGISTRY} 2>/dev/null) ]] ; then
        printf "${red}Not logged into npm! Try running npm login${end}"
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

    # Check npm registry is correct
    check_npm_registry || return 1

    # Check npm login
    check_npm_login || return 1

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

    # Build npm assets
    if ! build_assets; then
        printf "${red}Failed building npm assets!${end}"
        return 1
    fi

    # Check uncommitted files
    check_uncommitted_files || return 1

    # Check untracked files
    check_untracked_files || return 1

    # Run the release
    if ! HUSKY_SKIP_HOOKS=1 yarn semantic-release --no-ci; then
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
