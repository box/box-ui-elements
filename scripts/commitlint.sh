#!/usr/bin/env bash

# Adopted from https://github.com/wilau2/circleci-commitlint-step
# MIT License

set -o errexit
if [ -n "${CIRCLE_PULL_REQUEST}" ]
then
  PULL_REQUEST_DETAILS=$(curl https://api.github.com/repos/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}/pulls/${CIRCLE_PR_NUMBER})
  echo $PULL_REQUEST_DETAILS
  echo "---------------------"
  BASE_SHA1=$(node -pe 'JSON.parse(process.argv[1]).base.sha' "${PULL_REQUEST_DETAILS}")
  echo $BASE_SHA1
  echo "---------------------"
  HEAD_SHA1=$(node -pe 'JSON.parse(process.argv[1]).head.sha' "${PULL_REQUEST_DETAILS}")
  echo $HEAD_SHA1
  echo "---------------------"
  COMMIT_RANGE="${BASE_SHA1}...${HEAD_SHA1}"
  echo ${COMMIT_RANGE}
  echo "---------------------"
  git log ${COMMIT_RANGE} --pretty=%B | ./node_modules/.bin/commitlint
fi
