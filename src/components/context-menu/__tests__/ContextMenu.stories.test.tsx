describe('components/context-menu/ContextMenu', () => {
    const CONTEXT_MENU_STORIES = ['components-contextmenu--basic', 'components-contextmenu--with-submenu'];

    test.each(CONTEXT_MENU_STORIES)('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test.each(CONTEXT_MENU_STORIES)('looks visually correct when right-clicking on story %s', async id => {
        const page = await BoxVisualTestUtils.gotoStory(id);
        await page.waitForSelector('.context-menu-example-target');
        const coords = await page.evaluate(() => {
            const el = document.querySelector('.context-menu-example-target');
            if (el) {
                const { x, y } = el.getBoundingClientRect();
                return { x, y };
            }
            return { x: 0, y: 0 };
        });
        await page.mouse.click(coords.x + 400, coords.y + 10, { button: 'right' });
        await page.waitForSelector('.context-menu-element');
        const image = await page.screenshot();
        return expect(image).toMatchImageSnapshot();
    });
});
