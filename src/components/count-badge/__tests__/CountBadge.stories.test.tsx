describe('components/count-badge/CountBadge', () => {
    test.each([
        ['components-countbadge--without-animation'],
        ['components-countbadge--with-html-symbol-1'],
        ['components-countbadge--with-html-symbol-2'],
    ])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
