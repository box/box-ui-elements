#!/bin/bash

if [ "${CIRCLE_BRANCH}" != "master" ];
then
    echo "Detected branch is not master, running chromatic with manual acceptance"
    yarn --cwd /buie chromatic
else
    echo "Detected branch is master, auto-accepting changes"
    yarn --cwd /buie chromatic --auto-accept-changes
fi
