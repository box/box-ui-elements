import { expect, within } from '@storybook/test';
import { type StoryObj } from '@storybook/react';
import ContentSidebar from '../../ContentSidebar';
import BoxAISidebar from '../../BoxAISidebar';

const mockFeatures = {
    'boxai.sidebar.enabled': true,
};

export default {
    title: 'Elements/ContentSidebar/BoxAISidebar/tests/visual-regression-tests',
    component: ContentSidebar,
    args: {
        features: mockFeatures,
        fileId: global.FILE_ID,
        token: global.TOKEN,
    },
};

export const SimpleBoxAISidebarCheck: StoryObj<typeof BoxAISidebar> = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const sidebar = await canvas.findByRole('heading', { name: 'Box AI' }, { timeout: 5000 });
        expect(sidebar).toBeInTheDocument();
    },
};
