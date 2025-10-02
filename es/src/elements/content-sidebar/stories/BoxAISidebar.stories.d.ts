export declare const basic: {};
export declare const withFileTypeNotSupported: {
    args: {
        features: {
            boxai: {
                sidebar: {
                    disabledTooltip: string;
                    enabled: boolean;
                    showOnlyNavButton: boolean;
                };
            };
        };
    };
};
declare const _default: {
    title: string;
    component: any;
    args: {
        features: {
            'boxai.sidebar.enabled': boolean;
        };
        fileId: string;
        token: string;
        boxAISidebarProps: {
            createSessionRequest: () => {
                encodedSession: string;
            };
            fetchTimeout: {
                initial: number;
            };
            getAgentConfig: () => {};
            getAIStudioAgents: () => {};
            getAnswer: () => {};
            getAnswerStreaming: () => {};
            getSuggestedQuestions: any;
            hostAppName: string;
            isAgentSelectorEnabled: boolean;
            isAIStudioAgentSelectorEnabled: boolean;
            isCitationsEnabled: boolean;
            isDebugModeEnabled: boolean;
            isFeedbackEnabled: boolean;
            isIntelligentQueryMode: boolean;
            isMarkdownEnabled: boolean;
            isStopResponseEnabled: boolean;
            isStreamingEnabled: boolean;
            items: {
                id: string;
                name: string;
                type: string;
                fileType: string;
                status: string;
            }[];
            recordAction: () => {};
        };
    };
};
export default _default;
