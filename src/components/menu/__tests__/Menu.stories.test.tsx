describe('components/menu/Menu', () => {
    const MENU_STORY_WITH_SUBMENU = 'components-menu--with-submenu';
    const MENU_STORY_WITH_SUBMENU_FLIP = 'components-menu--with-submenu-flip';
    const MENU_STORY_WITH_SELECT_MENU = 'components-menu--with-select-menu';
    const MENU_STORY_WITH_CHILD_ON_RESIZE = 'components-menu--with-child-on-resize';

    test.each([
        MENU_STORY_WITH_SUBMENU,
        MENU_STORY_WITH_SUBMENU_FLIP,
        MENU_STORY_WITH_SELECT_MENU,
        MENU_STORY_WITH_CHILD_ON_RESIZE,
    ])('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test.each([MENU_STORY_WITH_SUBMENU, MENU_STORY_WITH_SUBMENU_FLIP])(
        'displays a submenu on hover in story %s',
        async id => {
            const image = await BoxVisualTestUtils.takeScreenshotAfterInput(id, '.submenu-target', 'hover');
            return expect(image).toMatchImageSnapshot();
        },
    );
});
