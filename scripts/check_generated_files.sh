#!/bin/bash

# translation properties file
PROPERTIES="i18n/en-US.properties"

# Styling variables
red=$"\e[1;31m"
green=$"\e[1;32m"
blue=$"\e[1;34m"
end=$"\e[0m\n"

check_generated_files() {

    printf "${blue}-------------------------------------------------------------${end}"
    printf "${blue}Building bundles again, this may update en-US.properties${end}"
    printf "${blue}-------------------------------------------------------------${end}"
    yarn --cwd /buie build:i18n || return 1

    # `yarn --cwd /buie ...` runs the build at /buie, but the executor's shell
    # working directory is ~/buie. Without `-C /buie`, git status would inspect
    # the wrong tree and silently miss generated changes (e.g. en-US.properties
    # drift when a PR adds defineMessages but forgets to commit the rebuilt
    # properties file).
    if [[ $(git -C /buie status --porcelain 2>/dev/null | egrep "^(M| M)") != "" ]]; then
        printf "${red}Your PR has uncommitted files!${end}"
        git -C /buie status --porcelain
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
