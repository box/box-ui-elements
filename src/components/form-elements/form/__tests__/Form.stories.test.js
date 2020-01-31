describe('components/form-elements/form/Form', () => {
    const FORM_STORY = 'components-form-elements-form--basic';
    const REQUIRED_FIELD_SELECTOR = 'input:required';
    const BUTTON_SELECTOR = 'button';

    test(`looks visually correct when using story ${FORM_STORY}`, async () => {
        const image = await BoxVisualTestUtils.takeScreenshot(FORM_STORY);
        return expect(image).toMatchImageSnapshot();
    });

    test('shows a required field error', async () => {
        const image = await BoxVisualTestUtils.takeScreenshotAfterInput(FORM_STORY, BUTTON_SELECTOR);
        return expect(image).toMatchImageSnapshot();
    });

    test.each`
        selector                                | userInput          | description
        ${'input[type="email"]'}                | ${'abcde'}         | ${'shows an email validation error'}
        ${'input[type="email"]'}                | ${'sally@foo.bar'} | ${'does not show an email validation error'}
        ${'input[name="customValidationFunc"]'} | ${'notbox'}        | ${'shows a custom validation error'}
        ${'input[name="customValidationFunc"]'} | ${'box'}           | ${'does not show a custom validation error'}
    `('$description', async ({ selector, userInput }) => {
        await global.page.goto(`http://localhost:6061/iframe.html?id=${FORM_STORY}`);
        await global.page.waitForSelector(REQUIRED_FIELD_SELECTOR);
        await BoxVisualTestUtils.clearInput(REQUIRED_FIELD_SELECTOR);
        await global.page.type(REQUIRED_FIELD_SELECTOR, 'zyxwv');
        await global.page.waitForSelector(selector);
        await global.page.type(selector, userInput);
        await global.page.click(BUTTON_SELECTOR);
        const image = await global.page.screenshot();
        return expect(image).toMatchImageSnapshot();
    });
});
