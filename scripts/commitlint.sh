#!/usr/bin/env bash

# Adopted from https://github.com/wilau2/circleci-commitlint-step
# MIT License

set -o errexit
if [ -n "${CIRCLE_PULL_REQUEST}" ]
then
  PULL_REQUEST_DETAILS=$(curl https://api.github.com/repos/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}/pulls/${CIRCLE_PR_NUMBER})
  BASE_SHA1=$(echo "${PULL_REQUEST_DETAILS}" | jq -r .base.sha)
  HEAD_SHA1=$(echo "${PULL_REQUEST_DETAILS}" | jq -r .head.sha)
  COMMIT_RANGE="${BASE_SHA1}...${HEAD_SHA1}"
  echo "${COMMIT_RANGE}"
  git log ${COMMIT_RANGE} --pretty=%B | ./node_modules/.bin/commitlint
fi
