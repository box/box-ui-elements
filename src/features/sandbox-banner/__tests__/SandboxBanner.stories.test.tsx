describe('features/sandbox-banner/SandboxBanner', () => {
    test.each([['features-sandboxbanner--basic']])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
