describe('components/dropdown-menu/DropdownMenu', () => {
    const DROPDOWN_MENU_STORIES = ['components-dropdownmenu--basic', 'components-dropdownmenu--with-link-menu'];

    test.each(DROPDOWN_MENU_STORIES)('looks visually correct when using story %s', async id => {
        const image = await takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test.each(DROPDOWN_MENU_STORIES)('looks visually correct when button is clicked in story %s', async id => {
        const image = await takeScreenshotAfterInput(id, '.menu-toggle');
        return expect(image).toMatchImageSnapshot();
    });
});
