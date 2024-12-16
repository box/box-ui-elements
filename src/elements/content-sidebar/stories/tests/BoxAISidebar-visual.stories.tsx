import { expect, fn, screen, userEvent, waitFor, within } from '@storybook/test';
import { type StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import ContentSidebar from '../../ContentSidebar';
import BoxAISidebar from '../../BoxAISidebar';
import { mockAgents } from '../__mocks__/BoxAISidebarMocks';
import { mockFileRequest, mockUserRequest } from '../../../__mocks__/mockRequests';

const mockFeatures = {
    'boxai.sidebar.enabled': true,
};

export const BoxAIInSidebar: StoryObj<typeof BoxAISidebar> = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const sidebar = await canvas.findByRole('heading', { name: 'Box AI' });
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
            const agentSelector = await screen.findByRole('button', { name: 'Agent Agent 1' });
            expect(agentSelector).toBeInTheDocument();

            await userEvent.click(agentSelector);
        });
    },
};

export const BoxAIWithClearButton: StoryObj<typeof BoxAISidebar> = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const sidebar = await canvas.findByRole('heading', { name: 'Box AI' });
        expect(sidebar).toBeInTheDocument();

        const clearButton = await canvas.findByRole('button', { name: 'Clear' });
        await userEvent.click(clearButton);
        expect(clearButton).toBeInTheDocument();
    },
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
    parameters: {
        msw: {
            handlers: [
                http.get(mockUserRequest.url, () => {
                    return HttpResponse.json(mockUserRequest.response);
                }),
                http.get(mockFileRequest.url, () => {
                    return HttpResponse.json(mockFileRequest.response);
                }),
            ],
        },
    },
};
