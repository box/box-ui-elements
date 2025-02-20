#!/usr/bin/env bash

lint_styles(){
    local fix_flag=$1
    local stylelint_cmd="stylelint --max-warnings 0"
    local prettier_cmd="prettier --check"
    local exit_code=0
    local color="\033[1;34m"
    local no_color="\033[0m"

    if [ "$fix_flag" == "--fix" ]; then
        stylelint_cmd="stylelint --fix --max-warnings 0"
        prettier_cmd="prettier --write"
    fi

    echo -e "${color}Running: $prettier_cmd --parser=scss src/**/*.scss${no_color}"
    $prettier_cmd --parser=scss "src/**/*.scss" --ignore-path .gitignore || exit_code=$?

    echo -e "${color}Running: $stylelint_cmd --syntax scss '**/*.scss'${no_color}"
    $stylelint_cmd --syntax scss "**/*.scss" --ignore-path .gitignore || exit_code=$?

    echo -e "${color}Running: $prettier_cmd --parser=css ./**/*.css${no_color}"
    $prettier_cmd --parser=css "./**/*.css" --ignore-path .gitignore || exit_code=$?

    echo -e "${color}Running: $stylelint_cmd --syntax css '**/*.css'${no_color}"
    $stylelint_cmd --syntax css "**/*.css" --ignore-path .gitignore || exit_code=$?

    return $exit_code
};

lint_styles $1
