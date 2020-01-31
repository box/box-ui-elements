describe('components/link/Link', () => {
    test.each(['components-links-link--basic', 'components-links-link--with-custom-component'])(
        'looks visually correct when using story %s',
        async id => {
            const image = await BoxVisualTestUtils.takeScreenshot(id);
            return expect(image).toMatchImageSnapshot();
        },
    );
});
