describe('components/checkbox/Checkbox', () => {
    test.each([
        ['components-checkbox--basic'],
        ['components-checkbox--controlled'],
        ['components-checkbox--disabled'],
        ['components-checkbox--withTooltip'],
        ['components-checkbox--withSubsection'],
    ])('looks visually correct when using story %s', async id => {
        const image = await takeScreenshot(id);
        expect(image).toMatchImageSnapshot();
    });
});
