#!/bin/bash

node -pe 'JSON.parse(process.argv[1]).version' "$(cat package.json)"
