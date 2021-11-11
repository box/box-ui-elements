// @ts-ignore flow import
import { DEFAULT_FORMAT_DEBOUNCE } from '../../../constants';

describe('components/time-input/TimeInput', () => {
    const INPUT_SELECTOR = 'input';
    const TIMEINPUT_STORIES = ['components-timeinput--required', 'components-timeinput--optional'];

    test.each(TIMEINPUT_STORIES)(`looks correct when using story %s`, async storyId => {
        const image = await BoxVisualTestUtils.takeScreenshot(storyId);
        return expect(image).toMatchImageSnapshot();
    });

    test.each`
        storyId                 | input           | testCase
        ${TIMEINPUT_STORIES[0]} | ${'11:51 p.m.'} | ${'sets a valid date based on input after blur'}
        ${TIMEINPUT_STORIES[0]} | ${'abcde'}      | ${'shows an error for invalid input after blur'}
        ${TIMEINPUT_STORIES[0]} | ${''}           | ${'shows an error for empty input after blur'}
        ${TIMEINPUT_STORIES[1]} | ${'11:51 p.m.'} | ${'sets a valid date based on input after blur'}
        ${TIMEINPUT_STORIES[1]} | ${'abcde'}      | ${'shows an error for invalid input after blur'}
        ${TIMEINPUT_STORIES[1]} | ${''}           | ${'shows default time for empty input after blur'}
    `('$testCase for story $storyId', async ({ storyId, input }) => {
        const page = await BoxVisualTestUtils.gotoStory(storyId);
        await page.waitForSelector(INPUT_SELECTOR);
        await BoxVisualTestUtils.clearInput(INPUT_SELECTOR, page);
        await page.type(INPUT_SELECTOR, input);
        await BoxVisualTestUtils.blurInput(INPUT_SELECTOR);

        const image = await page.screenshot();
        return expect(image).toMatchImageSnapshot();
    });

    test.each`
        storyId                 | input          | testCase
        ${TIMEINPUT_STORIES[0]} | ${'2:02 a.m.'} | ${'sets a valid date based on input after change'}
        ${TIMEINPUT_STORIES[0]} | ${'134525'}    | ${'shows an error for invalid input after change'}
        ${TIMEINPUT_STORIES[0]} | ${''}          | ${'shows an error for empty input after change'}
        ${TIMEINPUT_STORIES[1]} | ${'2:02 a.m.'} | ${'sets a valid date based on input after change'}
        ${TIMEINPUT_STORIES[1]} | ${'134525'}    | ${'shows an error for invalid input after change'}
        ${TIMEINPUT_STORIES[1]} | ${''}          | ${'shows default time for empty input after change'}
    `('$testCase for story $storyId', async ({ storyId, input }) => {
        const page = await BoxVisualTestUtils.gotoStory(storyId);
        await page.waitForSelector(INPUT_SELECTOR);
        await BoxVisualTestUtils.clearInput(INPUT_SELECTOR, page);
        await page.type(INPUT_SELECTOR, input);
        await BoxVisualTestUtils.sleep(DEFAULT_FORMAT_DEBOUNCE * 1.1);
        const image = await page.screenshot();
        return expect(image).toMatchImageSnapshot();
    });
});
