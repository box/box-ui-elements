#!/usr/bin/env bash

lint_misc(){
    local fix_flag=$1
    local prettier_cmd="prettier --check"
    local exit_code=0
    local color="\033[1;34m"
    local no_color="\033[0m"

    if [ "$fix_flag" == "--fix" ]; then
        prettier_cmd="prettier --write"
    fi

    echo -e "${color}Running: $prettier_cmd --parser=markdown ./**/*.md${no_color}"
    $prettier_cmd --parser=markdown "./**/*.md" --ignore-path .gitignore || exit_code=$?

    echo -e "${color}Running: $prettier_cmd --parser=json ./**/*.json${no_color}"
    $prettier_cmd --parser=json "./**/*.json" --ignore-path .gitignore || exit_code=$?

    echo -e "${color}Running: $prettier_cmd --parser=html ./**/*.html${no_color}"
    $prettier_cmd --parser=html "./**/*.html" --ignore-path .gitignore || exit_code=$?

    return $exit_code
};

lint_misc $1
