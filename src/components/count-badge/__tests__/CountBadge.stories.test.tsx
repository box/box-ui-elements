describe('components/count-badge/CountBadge', () => {
    test.each([
        ['components-badges-countbadge--without-animation'],
        ['components-badges-countbadge--with-html-symbol-1'],
        ['components-badges-countbadge--with-html-symbol-2'],
    ])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
