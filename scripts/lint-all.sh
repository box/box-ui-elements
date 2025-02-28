#!/usr/bin/env bash

lint_all(){
    local fix_flag=$1
    local exit_code=0

    ./scripts/lint-code.sh $fix_flag || exit_code=$?
    ./scripts/lint-styles.sh $fix_flag || exit_code=$?
    ./scripts/lint-misc.sh $fix_flag || exit_code=$?

    return $exit_code
};

lint_all $1
