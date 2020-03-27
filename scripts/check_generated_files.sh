#!/bin/bash

# translation properties file
PROPERTIES="i18n/en-US.properties"

# Styling variables
red=$"\e[1;31m"
green=$"\e[1;32m"
blue=$"\e[1;34m"
end=$"\e[0m\n"

check_generated_files() {
    printf "${blue}--------------------------------------${end}"
    printf "${blue}Checking react-intl v3 usage${end}"
    printf "${blue}--------------------------------------${end}"
    ./scripts/findReactIntlViolators.js || return 1

    printf "${blue}-------------------------------------------------------------${end}"
    printf "${blue}Building bundles again, this may update en-US.properties${end}"
    printf "${blue}-------------------------------------------------------------${end}"
    yarn build:i18n || return 1

    if [[ $(git status --porcelain 2>/dev/null| egrep "^(M| M)") != "" ]] ; then
        printf "${red}Your PR has uncommitted files!${end}"
        git status --porcelain
        return 1
    fi
}

# Execute this script
if ! check_generated_files; then
    printf "${red}--------------------------------------------------------------------------------${end}"
    printf "${red}Error: failure because build has generated artifacts or failed for other reasons${end}"
    printf "${red}--------------------------------------------------------------------------------${end}"
    exit 1
fi
