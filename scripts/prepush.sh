#!/bin/bash

# translation properties file
PROPERTIES="i18n/en-US.properties"

# Styling variables
red=$"\e[1;31m"
green=$"\e[1;32m"
blue=$"\e[1;34m"
end=$"\e[0m\n"

check_uncommitted_files() {
    if [[ $(git status --porcelain 2>/dev/null| egrep "^(M| M)") != "" ]] ; then
        printf "${red}Your branch has uncommitted files!${end}"
        return 1
    fi
}

# commit updated translations if any
check_and_commit_updated_translations() {
    if ! git diff --quiet HEAD $PROPERTIES; then
        printf "${red}--------------------------------------------------------${end}"
        printf "${red}Committing updated translations${end}"
        printf "${red}--------------------------------------------------------${end}"
        git add $PROPERTIES || exit 1
        git commit --amend --no-edit --no-verify || exit 1
        printf "${red}--------------------------------------------------------${end}"
        printf "${red}Amended commit with translations, please push again with --no-verify${end}"
        printf "${red}--------------------------------------------------------${end}"
        exit 1
    else
        printf "${green}--------------------------------------------------------${end}"
        printf "${green}en-US.properties is already up to date${end}"
        printf "${green}--------------------------------------------------------${end}"
    fi
}

# lint, test, and build assets to update translations
prepush() {
    printf "${blue}--------------------------------------${end}"
    printf "${blue}Checking react-intl v3 usage${end}"
    printf "${blue}--------------------------------------${end}"
    ./scripts/findReactIntlViolators.js || exit 1

    printf "${blue}-------------------------------------------------------------${end}"
    printf "${blue}Building all sources, this will update i18n/json${end}"
    printf "${blue}-------------------------------------------------------------${end}"
    yarn build:prod:es || exit 1

    check_uncommitted_files || exit 1

    printf "${blue}-------------------------------------------------------------${end}"
    printf "${blue}Building localized bundles, this will update en-US.properties${end}"
    printf "${blue}-------------------------------------------------------------${end}"
    yarn build:i18n || exit 1

    printf "${blue}-------------------------------------------------------------${end}"
    printf "${blue}Testing${end}"
    printf "${blue}-------------------------------------------------------------${end}"
    git fetch upstream
    yarn test --changedSince=upstream/master || exit 1

    check_and_commit_updated_translations
}

# Execute this script
if ! prepush; then
    printf "${red}---------------------------------------------------------${end}"
    printf "${red}Error: failure in prepush script${end}"
    printf "${red}---------------------------------------------------------${end}"
    exit 1
fi
