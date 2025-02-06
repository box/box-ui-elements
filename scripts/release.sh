#!/bin/bash

source ./scripts/cut_release.sh

# Execute this entire script
if ! push_new_release; then
    printf "${red}Failed creating a new release!${end}"
    printf "${red}Might still be on release branch!${end}"
    exit 1
fi

printf "${blue}Checking back out to master...${end}"
git checkout master || exit 1
