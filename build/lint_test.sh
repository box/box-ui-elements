#!/bin/bash

source ./build/variables.sh

lint_and_test() {
    printf "${blue}Running linter...${end}"
    if yarn lint; then
        printf "${green}Linting done!${end}"
    else
        printf "${red}Linting failed!${end}"
        exit 1;
    fi

    printf "${blue}Running flow...${end}"
    if yarn flow check; then
        printf "${green}Flow check done!${end}"
    else
        printf "${red}Flow check failed!${end}"
        exit 1;
    fi

    printf "${blue}Running tests...${end}"
    if yarn test; then
        printf "${green}Tests done!${end}"
    else
        printf "${red}Tests failed!${end}"
        exit 1;
    fi
}
