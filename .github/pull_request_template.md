<!-- Remove the sections that are not applicable -->

## Describe your changes

<!-- Descriptions can consist of describing the change and/or images of the change -->

## Checklist before requesting a review

- [ ] Is the PR title and first commit semantic?
- [ ] Have you checked if the test pass?
- [ ] Do the builds on github pass?

## Checklist if you are making UI changes

- [ ] Did you verify the changes against the mocks?
- [ ] Are your changes a11y compliant?
- [ ] Are your changes responsive? (if applicable)

## Checklist if you are adding new stories

- [ ] Have you ran `yarn start:storybook` to manually test your story?
- [ ] Have you added a test for the stories that you added?
- [ ] Have you ran `yarn test:visuals`
- [ ] Did you ensure you only added necessary changes for adding a story?

## Checklist if you are converting JS files to TS

<!-- Please follow the internal guide for conversion steps -->

- [ ] Did you delete the old snapshots if there were any?
- [ ] Did you convert the props to an interface?
- [ ] Did you fix the existing tests?
- [ ] Did you fill in the missing types?
- [ ] If the files you've migrated in `/components`, did you update `/components/index.ts` with exports and new components

## Checklist JS -> TS before requesting a review

- [ ] Are the code blocks in the components `tsx` spaced correctly?
- [ ] Did you run all the tests?
- [ ] Did you run `flow check`?
- [ ] Did you run `yarn lint`?
- [ ] If a story was added in conjunction with the conversion, did you run `yarn start:storybook`?
- [ ] Did you update `styleguide.config.js`?
