import {expect, fn, screen, userEvent, waitFor, within} from '@storybook/test';
import { type StoryObj } from '@storybook/react';
import {AgentType} from '@box/box-ai-agent-selector';
import ContentSidebar from '../../ContentSidebar';
import BoxAISidebar from '../../BoxAISidebar';

const mockFeatures = {
    'boxai.sidebar.enabled': true,
};

export const mockAgents: AgentType[] = [
    {
        id: '1',
        name: 'Agent 1',
        description: 'This is the default agent',
        isEnterpriseDefault: true,
        imageURL: 'https://cdn01.boxcdn.net/_assets/img/favicons/favicon-32x32.png',
    },
    {
        id: '2',
        name: 'Agent 2',
        description: 'This agent has a different description',
        isEnterpriseDefault: false,
    },
    {
        id: '3',
        name: 'Agent 3',
        isEnterpriseDefault: false,
        ask: { foo: 'foobar' },
    },
    {
        id: '4',
        name: 'Agent 4',
        description: 'This is agent 4',
        imageURL: 'https://cdn01.boxcdn.net/_assets/img/favicons/favicon-32x32.png',
    },
];

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
            const agentSelector = await screen.findByRole('button', {name: 'Agent Agent 1'}, { timeout: 5000 });
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
