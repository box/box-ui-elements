describe('components/checkbox/Checkbox', () => {
    test.each([
        ['components-checkbox--basic'],
        ['components-checkbox--controlled'],
        ['components-checkbox--disabled'],
        ['components-checkbox--with-tooltip'],
        ['components-checkbox--with-subsection'],
    ])('looks visually correct when using story %s', async id => {
        const image = await takeScreenshot(id);
        expect(image).toMatchImageSnapshot();
    });
});
