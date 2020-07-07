describe('components/tooltip/Tooltip', () => {
    test.each([
        ['components-tooltip--positioning'],
        ['components-tooltip--themes'],
        ['components-tooltip--with-close-cutton'],
        ['components-tooltip--is-shown'],
        ['components-tooltip--with-offset'],
        ['components-tooltip--with-disabled'],
        ['components-tooltip--attached-to-disabled-button'],
        ['components-tooltip--with-long-text'],
    ])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshotAfterInput(id, 'button', 'focus');
        return expect(image).toMatchImageSnapshot();
    });
});
