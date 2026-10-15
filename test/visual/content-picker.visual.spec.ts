import { expect, test } from '@playwright/test';
import { getContentPickerVisualStories, gotoStory } from './storybook';

// Keep in sync with exports in src/elements/content-picker/stories/tests/ContentPicker-visual.stories.js
const EXPECTED_STORY_IDS = [
    'elements-contentpicker-tests-visual--basic',
    'elements-contentpicker-tests-visual--custom-action-buttons',
    'elements-contentpicker-tests-visual--empty-state',
    'elements-contentpicker-tests-visual--error-empty-state',
    'elements-contentpicker-tests-visual--file-type-filter',
    'elements-contentpicker-tests-visual--multiple-select',
    'elements-contentpicker-tests-visual--search-empty-state',
    'elements-contentpicker-tests-visual--selected-empty-state',
    'elements-contentpicker-tests-visual--single-select',
    'elements-contentpicker-tests-visual--with-modernization',
    'elements-contentpicker-tests-visual--with-pagination',
];

const stories = getContentPickerVisualStories();

test.describe('ContentPicker Chromatic visual stories', () => {
    test('covers every exported ContentPicker visual story', () => {
        expect(stories.map(story => story.id).sort()).toEqual([...EXPECTED_STORY_IDS].sort());
    });

    stories.forEach(story => {
        test(`${story.title} / ${story.name}`, async ({ page }) => {
            await gotoStory(page, story.id);
            await expect(page.locator('#storybook-root')).toHaveScreenshot(`${story.id}.png`);
        });
    });
});
