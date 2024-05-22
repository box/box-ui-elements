#!/usr/bin/env bash

# Adopted from https://github.com/wilau2/circleci-commitlint-step
# MIT License

set -o errexit
if [ -n "${CIRCLE_PULL_REQUEST}" ]
then
  # Sometimes CIRCLE_PR_NUMBER is missing
  # See also: https://discuss.circleci.com/t/circle-pr-number-missing-from-environment-variables/3745/2
  CIRCLE_PR_NUMBER="${CIRCLE_PR_NUMBER:-${CIRCLE_PULL_REQUEST##*/}}"
  echo "Retrieving PR Details: https://api.github.com/repos/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}/pulls/${CIRCLE_PR_NUMBER}"
  PULL_REQUEST_DETAILS=$(curl https://api.github.com/repos/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}/pulls/${CIRCLE_PR_NUMBER})
  BASE_SHA1=$(node -pe 'JSON.parse(process.argv[1]).base.sha' "${PULL_REQUEST_DETAILS}")
  echo "Base SHA1: $BASE_SHA1"
  HEAD_SHA1=$(node -pe 'JSON.parse(process.argv[1]).head.sha' "${PULL_REQUEST_DETAILS}")
  echo "Head SHA1 $HEAD_SHA1"
  COMMIT_RANGE="${BASE_SHA1}...${HEAD_SHA1}"
  echo "Linting ${COMMIT_RANGE}"
  git log ${COMMIT_RANGE} --pretty=%B | ./node_modules/.bin/commitlint
fi
