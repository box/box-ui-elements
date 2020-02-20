describe('components/avatar/Avatar', () => {
    test.each([
        ['components-avatar--regular'],
        ['components-avatar--small'],
        ['components-avatar--large'],
        ['components-avatar--with-multiple-avatars'],
        ['components-avatar--without-name-or-initials'],
    ])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test.each([['components-avatar--with-avatar-url'], ['components-avatar--with-url-fallback-to-initials']])(
        'looks visually correct when using story %s',
        async id => {
            const image = await BoxVisualTestUtils.takeScreenshot(id);
            await BoxVisualTestUtils.sleep(100); // lets url load (race condition, wait for URL to 404)
            return expect(image).toMatchImageSnapshot();
        },
    );
});
