#!/bin/bash

# translation properties file
PROPERTIES="i18n/en-US.properties"

# commit updated translations if any
check_and_commit_updated_translations() {
    if ! git diff --quiet HEAD $PROPERTIES; then
        echo "--------------------------------------------------------"
        echo "Committing updated translations"
        echo "--------------------------------------------------------"
        git add $PROPERTIES || exit 1
        git commit --amend --no-edit --no-verify || exit 1
        echo "--------------------------------------------------------"
        echo "Amended commit with translations, please push again with --no-verify"
        echo "--------------------------------------------------------"
        exit 1
    fi
}

# lint, test, and build assets to update translations
prepush() {
    echo "--------------------------------------------------------"
    echo "Linting"
    echo "--------------------------------------------------------"
    yarn lint || exit 1

    echo "--------------------------------------------------------"
    echo "Checking flow types"
    echo "--------------------------------------------------------"
    yarn flow check || exit 1

    echo "--------------------------------------------------------"
    echo "Testing"
    echo "--------------------------------------------------------"
    yarn test || exit 1

    echo "--------------------------------------------------------"
    echo "Building"
    echo "--------------------------------------------------------"
    yarn build || exit 1

    check_and_commit_updated_translations
}

# Execute this script
if ! prepush; then
    echo "----------------------------------------------------"
    echo "Error: failure in prepush script"
    echo "----------------------------------------------------"
    exit 1
fi
