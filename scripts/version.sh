#!/bin/bash

get_version() {
    node -pe 'JSON.parse(process.argv[1]).version' "$(cat package.json)"
}

set_version() {
    jq --arg version "$1" '.version = $version' package.json > package.json.tmp && mv package.json.tmp package.json
}

case "${1:-get}" in
    "get")
        get_version
        ;;
    "set")
        set_version "$2"
        ;;
esac
