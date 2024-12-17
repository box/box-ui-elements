import ContentSidebar from '../ContentSidebar';

const mockFeatures = {
    'boxai.sidebar.enabled': true,
};

export const basic = {};

export default {
    title: 'Elements/ContentSidebar/BoxAISidebar',
    component: ContentSidebar,
    args: {
        features: mockFeatures,
        fileId: global.FILE_ID,
        token: global.TOKEN,
        boxAISidebarProps: {
            createSessionRequest: () => ({ encodedSession: '1234'}),
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
            isDebugModeEnabled: true,
            isIntelligentQueryMode: false,
            isMarkdownEnabled: true,
            isResetChatEnabled: true,
            isStopResponseEnabled: true,
            isStreamingEnabled: false,
            recordAction: () => ({}),
        }
    },
};
