import { sizeSmallMax } from '../../../styles/variables';

describe('components/modal/Modal', () => {
    const MODAL_STORIES = ['components-modal--basic', 'components-modal--with-custom-backdrop-click-handler'];

    test.each(MODAL_STORIES)('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test.each(MODAL_STORIES)('looks visually correct when button is clicked in story %s', async id => {
        const image = await BoxVisualTestUtils.takeModalScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });

    test.each(MODAL_STORIES)(
        'looks visually correct for small screens when button is clicked in story %s',
        async id => {
            const image = await BoxVisualTestUtils.takeModalScreenshot(id, parseInt(sizeSmallMax, 10));
            return expect(image).toMatchImageSnapshot();
        },
    );
});
