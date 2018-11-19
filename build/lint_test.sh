#!/bin/bash

lint_and_test() {
    echo "----------------------------------------------------"
    echo "Running linter"
    echo "----------------------------------------------------"
    if yarn lint; then
        echo "----------------------------------------------------"
        echo "Done linting"
        echo "----------------------------------------------------"
    else
        echo "----------------------------------------------------"
        echo "Failed linting!"
        echo "----------------------------------------------------"
        exit 1;
    fi


    echo "----------------------------------------------------"
    echo "Running flow"
    echo "----------------------------------------------------"
    if yarn flow check; then
        echo "----------------------------------------------------"
        echo "Done flow check"
        echo "----------------------------------------------------"
    else
        echo "----------------------------------------------------"
        echo "Failed flow check!"
        echo "----------------------------------------------------"
        exit 1;
    fi


    echo "----------------------------------------------------"
    echo "Running tests"
    echo "----------------------------------------------------"
    if yarn test; then
        echo "----------------------------------------------------"
        echo "Done testing"
        echo "----------------------------------------------------"
    else
        echo "----------------------------------------------------"
        echo "Failed testing!"
        echo "----------------------------------------------------"
        exit 1;
    fi
}
