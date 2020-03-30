describe('components/sidebar-toggle-button/SidebarToggleButton', () => {
    test.each([
        'components-sidebartogglebutton--open',
        'components-sidebartogglebutton--closed',
        'components-sidebartogglebutton--left-facing',
    ])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
