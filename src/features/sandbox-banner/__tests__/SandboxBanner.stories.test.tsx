describe('features/sandbox-banner/SandboxBanner', () => {
    test.each([['features-sandboxbanner--basic']])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test('should show a tooltip when the banner is hovered', async () => {
        const image = await BoxVisualTestUtils.takeScreenshotAfterInput(
            'features-sandboxbanner--basic',
            '.bdl-SandboxBanner',
            'hover',
        );
        return expect(image).toMatchImageSnapshot();
    });
});
