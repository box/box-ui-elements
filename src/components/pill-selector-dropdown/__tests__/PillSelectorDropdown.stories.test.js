describe('components/pill-selector-dropdown/PillSelectorDropdown', () => {
    test.each([['components-pillselectordropdown--empty'], ['components-pillselectordropdown--with-pills']])(
        'looks visually correct when using story %s',
        async id => {
            const image = await takeScreenshot(id);
            expect(image).toMatchImageSnapshot();
        },
    );
});
