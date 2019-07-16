#!/usr/bin/env bash
set -o errexit

PULL_REQUEST_NUMBER=$(echo "${CIRCLE_PULL_REQUEST}" | cut -d/ -f7)
PULL_REQUEST_DETAILS=$(curl https://api.github.com/repos/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}/pulls/${PULL_REQUEST_NUMBER})
BASE_SHA1=$(echo "${PULL_REQUEST_DETAILS}" | jq -r .base.sha)
HEAD_SHA1=$(echo "${PULL_REQUEST_DETAILS}" | jq -r .head.sha)
COMMIT_RANGE="${BASE_SHA1}...${HEAD_SHA1}"
echo "${COMMIT_RANGE}"
git log
git log ${COMMIT_RANGE} --pretty=%B | ./node_modules/.bin/commitlint
