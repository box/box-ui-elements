#!/bin/bash


VERDACCIO_PORT=4873
VERDACCIO_REGISTRY="http://localhost:$VERDACCIO_PORT"
PACKAGE_NAME="box-ui-elements"
TEST_APP_NAME="test-app"
TEST_APP_PORT=3000

echo "Setting up..."
npm install -g create-next-app --registry https://registry.npmjs.org/
npm install -g verdaccio --registry https://registry.npmjs.org/
verdaccio --version

echo "Starting Verdaccio..."
verdaccio --config ./scripts/app-testing/verdaccio.yaml &
VERDACCIO_PID=$!
echo "Verdaccio is running on PID: $VERDACCIO_PID"

echo "Setting npm registry to Verdaccio..."
echo "registry=$VERDACCIO_REGISTRY" > .npmrc
echo "npm registry is set to: "
npm get registry

echo "registry \"$VERDACCIO_REGISTRY\"" > .yarnrc
echo "yarn registry is set to: "
yarn config get registry

echo "Adding user to Verdaccio..."
expect -c "
spawn npm adduser --registry $VERDACCIO_REGISTRY
expect \"Username:\" { send \"testuser\r\"; exp_continue }
expect \"Password:\" { send \"testpass\r\"; exp_continue }
expect \"Email: \" { send \"testuser@example.com\r\"; exp_continue }
"
npm whoami --registry $VERDACCIO_REGISTRY

echo "Publishing package to Verdaccio..."
yarn install --force
yarn build:npm
npm publish --registry $VERDACCIO_REGISTRY
mkdir -p ~/test-apps
cd ~/test-apps
pwd

echo "Create test app..."
pwd
create-next-app $TEST_APP_NAME --yes
cd ./$TEST_APP_NAME
pwd
echo "registry=$VERDACCIO_REGISTRY" > .npmrc
echo "registry \"$VERDACCIO_REGISTRY\"" > .yarnrc
yarn add $PACKAGE_NAME

echo "Modify test app..."
pwd
cat > ./src/app/page.js <<EOL
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
      HELLO WORLD
      </main>
    </div>
  );
}
EOL

echo "Building test app..."
pwd
yarn build

echo "Starting test app..."
pwd
yarn start &
APP_PID=$!

sleep 10

echo "Verifying test app..."
curl --fail http://localhost:$TEST_APP_PORT || (echo "Test app failed to start" && exit 1)

echo "Resetting npm registry..."
npm set registry https://registry.npmjs.org/
yarn config set registry https://registry.yarnpkg.com/

echo "Stopping test app..."
kill $APP_PID

echo "Stopping Verdaccio..."
kill $VERDACCIO_PID

echo "Complete successfully!"
