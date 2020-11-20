describe('components/pill-selector-dropdown/PillSelectorDropdown', () => {
    const EMPTY_STATE = 'components-pillselectordropdown--empty';
    const WITH_PILLS = 'components-pillselectordropdown--with-pills';
    const SHOW_ROUNDED_PILLS = 'components-pillselectordropdown--show-rounded-pills';
    const SHOW_AVATARS = 'components-pillselectordropdown--show-avatars';
    const CUSTOM_PILL_STYLES = 'components-pillselectordropdown--custom-pill-styles';

    test.each([EMPTY_STATE, WITH_PILLS, SHOW_ROUNDED_PILLS, SHOW_AVATARS, CUSTOM_PILL_STYLES])(
        'looks visually correct when using story %s',
        async id => {
            const image = await BoxVisualTestUtils.takeScreenshot(id);
            return expect(image).toMatchImageSnapshot();
        },
    );

    test('looks visually correct when typing', async () => {
        const image = await BoxVisualTestUtils.takeScreenshotAfterInput(EMPTY_STATE, 'textarea', 'type', 'a');
        return expect(image).toMatchImageSnapshot();
    });
});
