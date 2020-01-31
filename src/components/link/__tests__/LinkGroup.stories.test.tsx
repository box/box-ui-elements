describe('components/link/LinkGroup', () => {
    const LINKGROUP_STORY = 'components-links-linkgroup--basic';
    test(`looks visually correct when using story ${LINKGROUP_STORY}`, async () => {
        const image = await BoxVisualTestUtils.takeScreenshot(LINKGROUP_STORY);
        return expect(image).toMatchImageSnapshot();
    });
});
