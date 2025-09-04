#!/bin/bash

# Temp version
VERSION="XXX"

# Styling variables
red=$"\n\e[1;31m(✖) "
green=$"\n\e[1;32m(✔) "
blue=$"\n\e[1;34m(ℹ) "
end=$"\e[0m\n"

# While running yarn, the registry changes to registry.yarnpkg.com which is a mirror to the public NPM registry
YARN_PUBLIC_REGISTRY_REGEX="^https:\/\/registry\.yarnpkg\.com\/?$"
NPM_PUBLIC_REGISTRY_REGEX="^https:\/\/registry\.npmjs\.org\/?$"
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
    printf "${blue}Determining dist-tag and branch...${end}"
    if [[ "$DIST" == "" ]]; then
        printf "${red}Could not determine a dist-tag, it should be either beta, latest, next or another string${end}"
        return 1
    elif [[ "$BRANCH" == "" ]]; then
        printf "${red}Could not determine the branch, it should be a valid branch like master, next or a tag${end}"
        if [[ "$HOTFIX" == true ]]; then
            printf "${red}For hotfix you must pass in the git tag branch, eg: BRANCH=vX.X.X yarn release:hotfix${end}"
        fi
        return 1
    else
        GIT_BRANCH=$BRANCH
        if [[ "$HOTFIX" == true ]]; then
            printf "${blue}This is a hotfix release from ${BRANCH}...${end}"
            git checkout $BRANCH || return 1
        elif [[ "$BRANCH" == 'master' ]]; then
            printf "${blue}This is a ${DIST} release, resetting hard from master...${end}"
            git checkout master || return 1
            git reset --hard release/master || return 1
        else
            printf "${blue}This is a ${DIST} release, resetting hard from ${BRANCH}...${end}"
            git checkout -t release/$BRANCH || return 1
        fi
        printf "${green}${BRANCH} checkout complete and dist-tag=${DIST} determined!${end}"
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

set_assets_version() {
    printf "${blue}Setting version in assets...${end}"

    # Replace the version variable in the transpiled output
    sed "s/__VERSION__/'$VERSION'/g" es/constants.js > es/constants.js.tmp && mv es/constants.js.tmp es/constants.js

    # Replace the version placeholder in the bundled output
    for file in dist/*.js; do
        sed "s/0.0.0-semantically-released/$VERSION/g" ${file} > ${file}.tmp && mv ${file}.tmp ${file}
    done

    printf "${green}Set assets to ${VERSION}!${end}"
}

push_to_npm() {
    printf "${blue}Publishing assets to npmjs...${end}"
    npm publish --access public --tag "$DIST" || return 1
    printf "${green}Published npm using dist-tag=${DISTTAG}!${end}"
}

build_storybook() {
    printf "${blue}Building storybook...${end}"
    yarn build:prod:storybook || return 1
    printf "${green}Built storybook!${end}"
}

push_to_gh_pages() {
    printf "${blue}Pushing storybook to gh-pages...${end}"
    if [[ $(git branch | grep -w "gh-pages") != "" ]] ; then
        git branch -D gh-pages || return 1
        printf "${green}Deleted existing gh-pages branch!${end}"
    fi
    git checkout -b gh-pages || return 1
    rm -rf docs
    cp .storybook/gitignore .gitignore || return 1
    mv storybook docs || return 1
    git rm -rf --cached . || return 1
    git add -A || return 1
    git commit --no-verify -am "build(storybook): v$VERSION" || return 1
    git push release gh-pages --force --no-verify || return 1
    printf "${blue}Pushed storybook to gh-pages...${end}"
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
    npm_registry=$(npm config get registry)
    if [[ ! $npm_registry =~ (${YARN_PUBLIC_REGISTRY_REGEX}|${NPM_PUBLIC_REGISTRY_REGEX}) ]] ; then
        printf "${red}${npm_registry} is not the correct registry! Make sure ~/.npmrc points to ${NPM_PUBLIC_REGISTRY}${end}"
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
    if ! HUSKY_SKIP_HOOKS=1 BRANCH=$BRANCH DIST=$DIST yarn semantic-release --no-ci; then
        printf "${red}Failed semantic release!${end}"
        return 1
    fi

    # Get the latest version from uncommitted package.json
    VERSION=$(source ./scripts/version.sh)

    # Make sure the version doesn't match the placeholder
    if [[ $VERSION == "0.0.0-semantically-released" ]] ; then
        printf "${red}No need to run a release!${end}"
        return 0
    fi

    # Set the version in the build assets
    set_assets_version || return 1

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

    # Build storybook
    if ! build_storybook; then
        printf "${red}Failed building storybook!${end}"
        return 1
    fi

    # Publish gh-pages
    if ! push_to_gh_pages; then
        printf "${red}Failed pushing storybook to gh-pages!${end}"
        return 1
    fi

    # Check uncommitted files
    check_uncommitted_files || return 1

    # Check untracked files
    check_untracked_files || return 1
}
