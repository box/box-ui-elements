#!/usr/bin/env bash

lint(){
    local fix_flag=$1
    local eslint_cmd="eslint --max-warnings 0"
    local stylelint_cmd="stylelint --max-warnings 0"
    local prettier_cmd="prettier --check"
    local exit_code=0
    local color="\033[1;34m"
    local no_color="\033[0m"

    if [ "$fix_flag" == "--fix" ]; then
        eslint_cmd="eslint --fix --max-warnings 0"
        stylelint_cmd="stylelint --fix --max-warnings 0"
        prettier_cmd="prettier --write"
    fi

    echo -e "${color}Running: $prettier_cmd --parser=flow src/**/*.js${no_color}"
    $prettier_cmd --parser=flow src/**/*.js --ignore-path .gitignore || exit_code=$?

    echo -e "${color}Running: $prettier_cmd --parser=typescript src/**/*.{ts,tsx}${no_color}"
    $prettier_cmd --parser=typescript src/**/*.{ts,tsx} --ignore-path .gitignore || exit_code=$?

    echo -e "${color}Running: $eslint_cmd src/**/*.{js,ts,tsx}${no_color}"
    $eslint_cmd src/**/*.{js,ts,tsx} || exit_code=$?

    echo -e "${color}Running: $prettier_cmd --parser=markdown ./**/*.md${no_color}"
    $prettier_cmd --parser=markdown ./**/*.md --ignore-path .gitignore || exit_code=$?

    echo -e "${color}Running: $prettier_cmd --parser=json ./**/*.json${no_color}"
    $prettier_cmd --parser=json ./**/*.json --ignore-path .gitignore || exit_code=$?

    echo -e "${color}Running: $prettier_cmd --parser=html ./**/*.html${no_color}"
    $prettier_cmd --parser=html ./**/*.html --ignore-path .gitignore || exit_code=$?

    echo -e "${color}Running: $prettier_cmd --parser=scss src/**/*.scss${no_color}"
    $prettier_cmd --parser=scss src/**/*.scss --ignore-path .gitignore || exit_code=$?

    echo -e "${color}Running: $stylelint_cmd --syntax scss '**/*.scss'${no_color}"
    $stylelint_cmd --syntax scss "**/*.scss" --ignore-path .gitignore || exit_code=$?

    echo -e "${color}Running: $prettier_cmd --parser=css ./**/*.css${no_color}"
    $prettier_cmd --parser=css ./**/*.css --ignore-path .gitignore || exit_code=$?

    echo -e "${color}Running: $stylelint_cmd --syntax css '**/*.css'${no_color}"
    $stylelint_cmd --syntax css "**/*.css" --ignore-path .gitignore || exit_code=$?

    return $exit_code
};

lint $1
