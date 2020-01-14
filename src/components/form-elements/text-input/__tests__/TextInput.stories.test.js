describe('components/form-elements/text-input/TextInput', () => {
    const INPUT_SELECTOR = 'input';
    const LABEL_SELECTOR = 'label';
    const TEXT_INPUT_STORIES = [
        'components-form-elements-textinput--basic',
        'components-form-elements-textinput--url-input',
        'components-form-elements-textinput--with-custom-validation',
        'components-form-elements-textinput--with-minimum-length',
        'components-form-elements-textinput--with-maximum-length',
        'components-form-elements-textinput--with-tooltip-on-hover',
        'components-form-elements-textinput--with-hidden-label',
        'components-form-elements-textinput--disabled-input',
    ];

    test.each(TEXT_INPUT_STORIES)('looks visually correct when using story %s', async id => {
        const image = await takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test.each`
        storyId                  | userInput                | description
        ${TEXT_INPUT_STORIES[1]} | ${'http://www.box.com'}  | ${'does not show a URL validation error'}
        ${TEXT_INPUT_STORIES[1]} | ${'https://www.box.com'} | ${'does not show a URL validation error'}
        ${TEXT_INPUT_STORIES[1]} | ${'www.box.com'}         | ${'shows a URL validation error'}
        ${TEXT_INPUT_STORIES[1]} | ${'zyxwv'}               | ${'shows a URL validation error'}
        ${TEXT_INPUT_STORIES[2]} | ${'notbox'}              | ${'shows a custom validation error'}
        ${TEXT_INPUT_STORIES[2]} | ${'box'}                 | ${'does not show a custom validation error'}
    `('$description', async ({ storyId, userInput }) => {
        await global.page.goto(`http://localhost:6061/iframe.html?id=${storyId}`);
        await global.page.waitForSelector(INPUT_SELECTOR);
        await global.page.type(INPUT_SELECTOR, userInput);
        const image = await global.page.screenshot();
        return expect(image).toMatchImageSnapshot();
    });

    test('shows min length error', async () => {
        await global.page.goto(`http://localhost:6061/iframe.html?id=${TEXT_INPUT_STORIES[3]}`);
        await global.page.waitForSelector(INPUT_SELECTOR);
        await global.page.waitForSelector(LABEL_SELECTOR);
        await global.page.type(INPUT_SELECTOR, 'a');
        await global.page.mouse.click(LABEL_SELECTOR);
        const image = await global.page.screenshot();
        return expect(image).toMatchImageSnapshot();
    });

    test.each`
        enteredInput | displayedInput
        ${'abcde'}   | ${'abcde'}
        ${'abcdef'}  | ${'abcde'}
    `('displays $displayedInput when given $enteredInput', async ({ enteredInput }) => {
        const image = await takeScreenshotAfterInput(TEXT_INPUT_STORIES[4], INPUT_SELECTOR, 'type', enteredInput);
        return expect(image).toMatchImageSnapshot();
    });

    test('shows tooltip on label hover', async () => {
        await global.page.goto(`http://localhost:6061/iframe.html?id=${TEXT_INPUT_STORIES[5]}`);
        await global.page.waitForSelector(LABEL_SELECTOR);
        await global.page.hover(LABEL_SELECTOR);
        const image = await global.page.screenshot();
        return expect(image).toMatchImageSnapshot();
    });
});
