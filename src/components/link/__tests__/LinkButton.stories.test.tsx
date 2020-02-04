describe('components/link/LinkButton', () => {
    test.each(['components-links-linkbutton--basic', 'components-links-linkbutton--with-custom-component'])(
        'looks visually correct when using story %s',
        async id => {
            const image = await BoxVisualTestUtils.takeScreenshot(id);
            return expect(image).toMatchImageSnapshot();
        },
    );
});
