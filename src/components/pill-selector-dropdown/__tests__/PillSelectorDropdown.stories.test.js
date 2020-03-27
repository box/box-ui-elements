describe('components/pill-selector-dropdown/PillSelectorDropdown', () => {
    const EMPTY_STATE = 'components-pillselectordropdown--empty';
    const WITH_PILLS = 'components-pillselectordropdown--with-pills';

    test.each([EMPTY_STATE, WITH_PILLS])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test('looks visually correct when typing', async () => {
        const image = await BoxVisualTestUtils.takeScreenshotAfterInput(EMPTY_STATE, 'textarea', 'type', 'a');
        return expect(image).toMatchImageSnapshot();
    });
});
