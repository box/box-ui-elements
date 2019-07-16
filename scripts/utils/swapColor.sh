#!/usr/bin/env bash

###
# Simple script to replace a single color value across multiple files
###

red=$"\n\e[1;31m(✖) "
end=$"\e[0m\n"

if [ ! $# -eq 3 ]; then
    echo "${red}You must specify the file, fromColor and toColor value${end}"
    exit 1
fi

sed -i '' -e "s/$2/$3/g" $1

exit 0