describe('components/context-menu/ContextMenu', () => {
    const CONTEXT_MENU_STORIES = ['components-contextmenu--basic', 'components-contextmenu--with-submenu'];

    test.each(CONTEXT_MENU_STORIES)('looks visually correct when using story %s', async id => {
        const image = await takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test.each(CONTEXT_MENU_STORIES)('looks visually correct when right-clicking on story %s', async id => {
        await global.page.goto(`http://localhost:6061/iframe.html?id=${id}`);
        await global.page.waitForSelector('div');
        await global.page.mouse.click(400, 10, { button: 'right' });
        const image = await global.page.screenshot();
        return expect(image).toMatchImageSnapshot();
    });
});
