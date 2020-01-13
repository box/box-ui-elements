describe('components/avatar/Avatar', () => {
    test.each([
        ['components-avatar--regular'],
        ['components-avatar--with-avatar-url'],
        ['components-avatar--with-multiple-avatars'],
        ['components-avatar--without-name-or-initials'],
    ])('looks visually correct when using story %s', async id => {
        const image = await takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
