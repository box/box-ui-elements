import {expect, fn, screen, userEvent, waitFor, within} from '@storybook/test';
import { type StoryObj } from '@storybook/react';
import ContentSidebar from '../../ContentSidebar';
import BoxAISidebar from '../../BoxAISidebar';
import {mockAgents} from "../__mocks__/BoxAISidebarMocks";

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
        selectedAgent: mockAgents[0],
    },
};

export const BoxAIInSidebar: StoryObj<typeof BoxAISidebar> = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const sidebar = await canvas.findByRole('heading', { name: 'Box AI' }, { timeout: 5000 });
        expect(sidebar).toBeInTheDocument();
    },
};

export const BoxAIWithAgentSelectorOpened: StoryObj<typeof BoxAISidebar> = {
    args: {
        features: {
            ...mockFeatures,
            'boxai.agentSelector.enabled': true,
        },
        boxAISidebarProps: {
            onClearClick: fn,
            agents: mockAgents,
            selectedAgent: mockAgents[0],
        },

    },
    play: async () => {
        await waitFor(async () => {
            const agentSelector = await screen.findByRole('button', {name: 'Agent Agent 1'}, { timeout: 2000 });
            expect(agentSelector).toBeInTheDocument();

            await userEvent.click(agentSelector);
        });
    },
};

export const BoxAIWithClearButton: StoryObj<typeof BoxAISidebar> = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const clearButton = await canvas.findByRole('button', { name: 'Clear' }, { timeout: 5000 });
        await userEvent.click(clearButton);
    },
};
