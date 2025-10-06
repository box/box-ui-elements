import { expect, userEvent, waitFor, within } from 'storybook/test';
import sleep from '../../../../utils/sleep';
import ContentPicker from '../../ContentPicker';

export const basic = {
    args: {
        maxSelectable: 99,
    },
};

export const withPagination = {
    args: {
        initialPageSize: 3,
    },
};

// This test covers a regression where different values for type would sometimes result in broken folder navigation
// where clicking on a folder would trigger the API call but not refresh the UI
export const singleSelectWithItemTypes = {
    args: {
        maxSelectable: 1,
        type: 'file,folder',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(
            () => {
                expect(canvas.getByRole('button', { name: 'An Ordered Folder' })).toBeInTheDocument();
            },
            { timeout: 10000 },
        );
        await sleep(1000);
        userEvent.click(canvas.getByRole('button', { name: 'An Ordered Folder' }));

        await waitFor(() => {
            expect(canvas.getByRole('gridcell', { name: 'Audio.mp3' })).toBeInTheDocument();
        });
    },
};

export default {
    title: 'Elements/ContentPicker/tests/e2e',
    component: ContentPicker,
    args: {
        features: global.FEATURE_FLAGS,
        rootFolderId: global.FOLDER_ID,
        token: global.TOKEN,
    },
};
