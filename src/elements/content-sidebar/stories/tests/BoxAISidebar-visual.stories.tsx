import { expect, userEvent, within } from '@storybook/test';
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

export const BoxAIInSidebar: StoryObj<typeof BoxAISidebar> = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const sidebar = await canvas.findByRole('heading', { name: 'Box AI' }, { timeout: 5000 });
        expect(sidebar).toBeInTheDocument();
    },
};

export const BoxAIWithAgentSelector: StoryObj<typeof BoxAISidebar> = {
    args: {
        features: {
            ...mockFeatures,
            'boxai.agentSelector.enabled': true,
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const agentSelector = await canvas.findByTestId('sidebar-agent-selector');
        expect(agentSelector).toBeInTheDocument();
    },
};

export const BoxAIWithClearButton: StoryObj<typeof BoxAISidebar> = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const clearButton = await canvas.findByRole('button', { name: 'Clear' }, { timeout: 5000 });
        await userEvent.click(clearButton);
    },
};
