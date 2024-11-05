#!/bin/bash


set -e

VERDACCIO_PORT=4873
VERDACCIO_REGISTRY="http://localhost:$VERDACCIO_PORT"
PACKAGE_NAME="box-ui-elements"
TEST_APP_NAME="test-app"
TEST_APP_PORT=3000

echo "Setting up..."
npm install -g verdaccio
verdaccio --version

echo "Starting Verdaccio..."
verdaccio --config scripts/app-testing/verdaccio.yaml &
