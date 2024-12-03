#!/bin/bash

if [ "${CIRCLE_BRANCH}" != "master" ];
then
    echo "Detected branch is not master, running chromatic with manual acceptance"
    yarn chromatic --debug --diagnostics-file=true
else
    echo "Detected branch is master, auto-accepting changes"
    yarn chromatic --auto-accept-changes
fi
