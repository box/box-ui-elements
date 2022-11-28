<!-- Remove the sections that are not applicable -->

## Describe your changes

<!-- Descriptions can consist of describing the change and/or images of the change -->
<!-- Refrain from posting anything that refers to internal information -->

| Before               | After               |
| -------------------- | ------------------- |
| Paste original image | Paste changed image |

## Checklist before requesting a review

- [ ] Is the PR title and/or first commit semantic? <!-- refer: https://github.com/box/box-ui-elements/blob/master/CONTRIBUTING.md#commit-types -->
- [ ] Have you checked if the tests pass?
- [ ] Did the build on CircleCi pass?
- [ ] Are the checks on GitHub passing?

## Checklist making a change

- [ ] Did you verify the changes against the mocks?
- [ ] Are your changes a11y compliant?
- [ ] Are your changes responsive? (if applicable)
- [ ] Did you test your changes in a parent app?

## Checklist if you are adding new stories

- [ ] Have you run `yarn start:storybook` to manually test your changes?
- [ ] Did you ensure you only added necessary changes for adding a story?

## Checklist if you are converting JS files to TS

<!-- Please follow the internal guide for conversion steps -->

- [ ] Did you delete the old snapshots if there were any?
- [ ] Did you convert the props to an interface?
- [ ] Did you fix the existing tests?
- [ ] Did you fill in the missing types?
- [ ] If the files you've migrated are in `/components`, did you update `/components/index.ts` with exports and new components

## Checklist JS -> TS before requesting a review

- [ ] Are the code blocks in the components `tsx` spaced correctly?
- [ ] Did you run all the tests?
- [ ] Did you run `flow check`?
- [ ] Did you run `yarn lint`?
- [ ] If a story was added in conjunction with the conversion, did you run `yarn start:storybook`?
- [ ] Did you update `styleguide.config.js`?

<!-- Faqs -->
<!--
1. If everything is green except the mergify check, it is possible you have changes requests by someone or missing approvals
2. If your build failed in CircleCi due to an e2e then rebuild a couple of times before reporting the issues
-->

## Approved? add the ready-to-merge label to your PR
