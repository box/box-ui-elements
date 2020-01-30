describe('components/breadcrumb/Breadcrumb', () => {
    test.each([['components-breadcrumb--regular'], ['components-breadcrumb--with-multiple-crumbs']])(
        'looks visually correct when using story %s',
        async id => {
            const image = await BoxVisualTestUtils.takeScreenshot(id);
            return expect(image).toMatchImageSnapshot();
        },
    );
});
