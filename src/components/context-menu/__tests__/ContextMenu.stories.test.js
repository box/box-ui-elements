describe('components/context-menu/ContextMenu', () => {
    const CONTEXT_MENU_STORIES = ['components-contextmenu--basic', 'components-contextmenu--with-submenu'];

    test.each(CONTEXT_MENU_STORIES)('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test.each(CONTEXT_MENU_STORIES)('looks visually correct when right-clicking on story %s', async id => {
        await global.page.goto(`http://localhost:6061/iframe.html?id=${id}`);
        await global.page.waitForSelector('.context-menu-example-target');
        const coords = await global.page.evaluate(() => {
            const el = document.querySelector('.context-menu-example-target');
            const { x, y } = el.getBoundingClientRect();
            return { x, y };
        });
        await global.page.mouse.click(coords.x + 400, coords.y + 10, { button: 'right' });
        await global.page.waitForSelector('.context-menu-element');
        const image = await global.page.screenshot();
        return expect(image).toMatchImageSnapshot();
    });
});
