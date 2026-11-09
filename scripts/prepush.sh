#!/bin/bash

# Styling variables
red=$"\e[1;31m"
green=$"\e[1;32m"
blue=$"\e[1;34m"
end=$"\e[0m\n"

check_uncommitted_files() {
    if [[ $(git status --porcelain 2>/dev/null | egrep "^(M| M)") != "" ]]; then
        printf "${red}Your branch has uncommitted files!${end}"
        return 1
    fi
}

# lint, test, and build assets
prepush() {

    printf "${blue}-------------------------------------------------------------${end}"
    printf "${blue}Building all sources${end}"
    printf "${blue}-------------------------------------------------------------${end}"
    yarn build:prod:es || exit 1

    check_uncommitted_files || exit 1

    printf "${blue}-------------------------------------------------------------${end}"
    printf "${blue}Building localized bundles${end}"
    printf "${blue}-------------------------------------------------------------${end}"
    yarn build:i18n || exit 1

    printf "${blue}-------------------------------------------------------------${end}"
    printf "${blue}Testing${end}"
    printf "${blue}-------------------------------------------------------------${end}"
    git fetch upstream
    yarn test --changedSince=upstream/master || exit 1
}

# Execute this script
if ! prepush; then
    printf "${red}---------------------------------------------------------${end}"
    printf "${red}Error: failure in prepush script${end}"
    printf "${red}---------------------------------------------------------${end}"
    exit 1
fi
