#!/bin/bash

export NODE_PATH=$NODE_PATH:./node_modules

update_version() {
    CURRENT_VERSION="$(cat package.json | grep \"box-react-ui\"\: -m 1 | sed 's/.*\^\(.*\)\".*/\1/')";
    LATEST_VERSION="$(npm show box-react-ui version)";

    # Upgrade peer dependency
    yarn add box-react-ui@^$LATEST_VERSION --peer

    # Upgrade dev dependency
    yarn add box-react-ui@^$LATEST_VERSION --dev

    UPDATED_VERSION="$(cat package.json | grep box-react-ui | sed 's/.*\^\(.*\)\".*/\1/')";

    if [ $UPDATED_VERSION == $LATEST_VERSION ]; then
        echo "----------------------------------------------------------------------"
        echo "Successfully upgraded from $CURRENT_VERSION to $UPDATED_VERSION"
        echo "----------------------------------------------------------------------"
    else
        echo "----------------------------------------------------------------------"
        echo "Error: Failed to upgrade to $CURRENT_VERSION"
        echo "----------------------------------------------------------------------"
    fi
}


push_to_github() {
    # Add new files
    git add . && git commit -m "Update: box-react-ui to v$LATEST_VERSION" -m

    # Push commit to GitHub
    if git push origin -f --no-verify; then
        echo "----------------------------------------------------------------------"
        echo "Pushed commit to git successfully"
        echo "----------------------------------------------------------------------"
    else
        echo "----------------------------------------------------------------------"
        echo "Error while pushing commit to git"
        echo "----------------------------------------------------------------------"
        return 1
    fi
}


reset_to_master() {
    # Add the upstream remote if it is not present
    if ! git remote get-url github-upstream; then
        git remote add github-upstream git@github.com:box/box-ui-elements.git || return 1
    fi

    # Fetch latest code
    git fetch github-upstream || return 1;
    git checkout master || return 1

    # The master branch should not have any commits
    if [[ $(git log --oneline ...github-upstream/master) != "" ]] ; then
        echo "----------------------------------------------------"
        echo "Your branch has unmerged commits!"
        echo "----------------------------------------------------"
        exit 1
    fi

    # Reset to latest code and clear unstashed changes
    git reset --hard github-upstream/master || return 1
}


upgrade_brui() {
    if [[ $(git diff --shortstat 2> /dev/null | tail -n1) != "" ]] ; then
        echo "----------------------------------------------------"
        echo "Your branch is dirty!"
        echo "----------------------------------------------------"
        exit 1
    fi

    # Get latest commited code and tags
    reset_to_master || return 1

    # Bump the version number
    update_version || return 1

    # Push to GitHub
    push_to_github || return 1

    return 0
}

# Execute this entire script
if ! upgrade_brui; then
    echo "----------------------------------------------------------------------"
    echo "Error while upgrading box-react-ui to latest version!"
    echo "----------------------------------------------------------------------"

    # Reset to upstream/master for major/minor releases
    elif ! reset_to_master; then
        echo "----------------------------------------------------------------------"
        echo "Error while cleaning workspace!"
        echo "----------------------------------------------------------------------"
    else
        echo "----------------------------------------------------------------------"
        echo "Workspace succesfully cleaned!"
        echo "----------------------------------------------------------------------"
    fi;
    exit 1
fi
