// @flow
import { userEvent, waitFor, within } from '@storybook/testing-library';
import ContentExplorer from '../ContentExplorer';

export const basic = {};

export const withSidebar = {
    args: {
        contentPreviewProps: {
            contentSidebarProps: {
                detailsSidebarProps: {
                    hasProperties: true,
                    hasNotices: true,
                    hasAccessStats: true,
                    hasClassification: true,
                    hasRetentionPolicy: true,
                    hasVersions: true,
                },
                features: global.FEATURE_FLAGS,
                hasActivityFeed: true,
                hasMetadata: true,
                hasSkills: true,
            },
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(
            async () => {
                const row = canvas.getByText('Book Sample.pdf');
                await userEvent.click(row);
            },
            {
                timeout: 3250,
            },
        );
    },
};

export default {
    title: 'Elements/ContentExplorer',
    component: ContentExplorer,
    args: {
        features: global.FEATURE_FLAGS,
        rootFolderId: global.FOLDER_ID,
        token: global.TOKEN,
    },
};
