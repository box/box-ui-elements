describe('features/unified-share-modal/UnifiedShareModal', () => {
    test.each([
        'features-unifiedsharemodal--basic',
        'features-unifiedsharemodal--with-shared-link',
        'features-unifiedsharemodal--with-autofocused-shared-link',
    ])('looks visually correct when button is clicked in story %s', async id => {
        const image = await BoxVisualTestUtils.takeModalScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    const USF_STORY = 'features-unifiedsharemodal--with-form-only';

    describe(`${USF_STORY}`, () => {
        beforeEach(async () => {
            await global.page.goto(`http://localhost:6061/iframe.html?id=${USF_STORY}`);
            await global.page.waitFor(2000); // wait for loading animation to finish
        });

        test('looks visually correct', async () => {
            const image = await global.page.screenshot();
            return expect(image).toMatchImageSnapshot();
        });

        test('looks visually correct when adding emails', async () => {
            await global.page.type('textarea', 's');
            const image = await global.page.screenshot();
            return expect(image).toMatchImageSnapshot();
        });
    });
});
