import { expect, within } from '@storybook/test';
import { type StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import ContentSidebar from '../../ContentSidebar';
import BoxAISidebar from '../../BoxAISidebar';
import { mockFileRequest, mockUserRequest } from '../../../__mocks__/mockRequests';

const mockFeatures = {
    'boxai.sidebar.enabled': true,
};

export const basic: StoryObj<typeof BoxAISidebar> = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const clearButton = await canvas.findByRole('button', { name: 'Clear conversation' });
        expect(clearButton).toBeInTheDocument();

        expect(await canvas.findByText('Welcome to Box AI')).toBeInTheDocument();
        expect(await canvas.findByText('Ask questions about')).toBeInTheDocument();
        expect(await canvas.findByText('This chat will be cleared when you close this content')).toBeInTheDocument();
        expect(await canvas.findByPlaceholderText('Ask anything about this content')).toBeInTheDocument();
        expect(await canvas.findByText('Summarize this document')).toBeInTheDocument();
        expect(await canvas.findByText('What are the key takeaways?')).toBeInTheDocument();
        expect(await canvas.findByText('How can this document be improved?')).toBeInTheDocument();
        expect(await canvas.findByText('Are there any next steps defined?')).toBeInTheDocument();
    },
};

export default {
    title: 'Elements/ContentSidebar/BoxAISidebar/tests/visual-regression-tests',
    component: ContentSidebar,
    args: {
        features: mockFeatures,
        fileId: global.FILE_ID,
        token: global.TOKEN,
        boxAISidebarProps: {
            createSessionRequest: () => ({ encodedSession: '1234' }),
            fetchTimeout: { initial: 20000 },
            getAgentConfig: () => ({}),
            getAIStudioAgents: () => ({}),
            getAnswer: () => ({}),
            getAnswerStreaming: () => ({}),
            getSuggestedQuestions: null,
            hostAppName: 'storybook-test',
            isAgentSelectorEnabled: false,
            isAIStudioAgentSelectorEnabled: true,
            isCitationsEnabled: true,
            isFeedbackEnabled: true,
            isDebugModeEnabled: true,
            isIntelligentQueryMode: false,
            isMarkdownEnabled: true,
            isResetChatEnabled: true,
            isStopResponseEnabled: true,
            isStreamingEnabled: false,
            items: [{ id: '123', name: 'Document (PDF).pdf', type: 'file', fileType: 'pdf', status: 'supported' }],
            recordAction: () => ({}),
        },
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
