#!/bin/bash

export NODE_PATH=$NODE_PATH:./node_modules


install_dependencies() {
    echo "--------------------------------------------------------"
    echo "Installing all package dependencies"
    echo "--------------------------------------------------------"
    if yarn install; then
        echo "----------------------------------------------------"
        echo "Installed dependencies successfully."
        echo "----------------------------------------------------"
    else
        echo "----------------------------------------------------"
        echo "Error: Failed to run 'yarn install'!"
        echo "----------------------------------------------------"
        exit 1;
    fi
}

move_reports() {
    echo "--------------------------------------------------------------------------"
    echo "Moving test reports to ./reports/cobertura.xml and ./reports/junit.xml"
    echo "--------------------------------------------------------------------------"
    mv ./reports/coverage/cobertura/*/cobertura-coverage.xml ./reports/cobertura.xml;
    mv ./reports/coverage/junit/*/junit.xml ./reports/junit.xml;
}

lint_and_test() {
    echo "----------------------------------------------------"
    echo "Running linter for version" $VERSION
    echo "----------------------------------------------------"
    if yarn run lint; then
        echo "----------------------------------------------------"
        echo "Done linting for version" $VERSION
        echo "----------------------------------------------------"
    else
        echo "----------------------------------------------------"
        echo "Failed linting!"
        echo "----------------------------------------------------"
        exit 1;
    fi


    echo "----------------------------------------------------"
    echo "Running tests for version" $VERSION
    echo "----------------------------------------------------"
    if yarn run test; then
        echo "----------------------------------------------------"
        echo "Done testing for version" $VERSION
        echo "----------------------------------------------------"
        move_reports
    else
        echo "----------------------------------------------------"
        echo "Failed testing!"
        echo "----------------------------------------------------"
        move_reports
        exit 1;
    fi
}

# Clean node modules, re-install dependencies, and build assets
build_assets() {
    echo "-----------------------------------------"
    echo "Starting build for version" $VERSION
    echo "-----------------------------------------"
    if yarn run build-ci; then
        echo "----------------------------------------------------"
        echo "Built assets for version" $VERSION
        echo "----------------------------------------------------"
    else
        echo "----------------------------------------------------"
        echo "Failed to build assets!"
        echo "----------------------------------------------------"
        exit 1;
    fi
}

# Install node modules
if ! install_dependencies; then
    echo "----------------------------------------------------"
    echo "Error in install_dependencies!"
    echo "----------------------------------------------------"
    exit 1
fi

# Do testing and linting
if ! lint_and_test; then
    echo "----------------------------------------------------"
    echo "Error in lint_and_test!"
    echo "----------------------------------------------------"
    exit 1
fi

if ! build_assets; then
    echo "----------------------------------------------------"
    echo "Error: failure in build_pull_request - build errors"
    echo "----------------------------------------------------"
    exit 1
fi
