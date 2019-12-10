import Button from '../../../components/button/Button';

describe('features/shared-link-modal/SharedLinkModal', () => {
    test('looks visually correct when using story components-sharedlinkmodal--basic', async id => {
        const image = await takeScreenshot(id);
        expect(image).toMatchImageSnapshot();
    });

    test('looks visually correct when button is clicked', async id => {
        const image = await takeScreenshot(id);
        const buttonSelector = Button.className;
        await global.page.waitForSelector(buttonSelector, 10000);
        global.page.click(buttonSelector);
        expect(image).toMatchImageSnapshot();
    });
});
