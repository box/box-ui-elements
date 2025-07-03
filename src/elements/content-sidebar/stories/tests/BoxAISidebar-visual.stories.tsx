import { type StoryObj, type Meta } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { http, HttpResponse } from 'msw';
import type { HttpHandler } from 'msw';
import ContentSidebar from '../../ContentSidebar';
import BoxAISidebar from '../../BoxAISidebar';
import { mockFileRequest, mockUserRequest } from '../../../common/__mocks__/mockRequests';

const mockFeatures = {
    'boxai.sidebar.enabled': true,
};

export const basic: StoryObj<typeof BoxAISidebar> = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const clearButton = await canvas.findByRole('button', { name: 'Clear conversation' });
        expect(clearButton).toBeInTheDocument();

        expect(await canvas.findByText(/Welcome to Box AI/i)).toBeInTheDocument();
        expect(await canvas.findByText('Chat cleared when you close content')).toBeInTheDocument();
        expect(await canvas.findByPlaceholderText('Ask Box AI')).toBeInTheDocument();
        expect(await canvas.findByText('Summarize this document')).toBeInTheDocument();
        expect(await canvas.findByText('What are the key takeaways?')).toBeInTheDocument();
        expect(await canvas.findByText('How can this document be improved?')).toBeInTheDocument();
        expect(await canvas.findByText('Are there any next steps defined?')).toBeInTheDocument();
    },
};

const meta: Meta<typeof ContentSidebar> & { parameters: { msw: { handlers: HttpHandler[] } } } = {
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
            localizedQuestions: [
                {
                    id: 'suggested-question-1',
                    label: 'Summarize this document',
                    prompt: 'Summarize this document',
                },
                {
                    id: 'suggested-question-2',
                    label: 'What are the key takeaways?',
                    prompt: 'What are the key takeaways?',
                },
                {
                    id: 'suggested-question-3',
                    label: 'How can this document be improved?',
                    prompt: 'How can this document be improved?',
                },
                {
                    id: 'suggested-question-4',
                    label: 'Are there any next steps defined?',
                    prompt: 'Are there any next steps defined?',
                },
            ],
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

export default meta;
