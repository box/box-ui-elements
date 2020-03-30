describe('components/menu/SelectMenuLinkItem', () => {
    const SELECT_MENU_LINK_ITEM_STORY = 'components-selectmenulinkitem--basic';
    test(`looks visually correct when using story ${SELECT_MENU_LINK_ITEM_STORY}`, async () => {
        const image = await BoxVisualTestUtils.takeScreenshot(SELECT_MENU_LINK_ITEM_STORY);
        return expect(image).toMatchImageSnapshot();
    });
});
