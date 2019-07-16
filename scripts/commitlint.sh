#!/usr/bin/env bash
set -o errexit

PULL_REQUEST_NUMBER=$(echo "${CIRCLE_PULL_REQUEST}" | cut -d/ -f7)
PULL_REQUEST_DETAILS=$(curl https://api.github.com/repos/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}/pulls/${PULL_REQUEST_NUMBER})
HEAD_SHA1=$(echo "${PULL_REQUEST_DETAILS}" | jq -r .head.sha)
COMMIT_RANGE=origin/master...${HEAD_SHA1}
git log ${COMMIT_RANGE} --pretty=%B | ./node_modules/.bin/commitlint
