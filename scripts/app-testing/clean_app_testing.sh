#!/bin/bash

echo "Cleaning up..."
rm -rf ./scripts/app-testing/verdaccio
rm -rf ~/test-apps
npm cache clean --force || true
