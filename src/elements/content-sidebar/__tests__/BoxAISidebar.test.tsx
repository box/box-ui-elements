import React from 'react';
import { userEvent } from '@testing-library/user-event';
import { render, screen } from '../../../test-utils/testing-library';
import BoxAISidebar, { BoxAISidebarProps } from '../BoxAISidebar';
import messages from "../../common/content-answers/messages";

jest.mock('@box/box-ai-agent-selector', () => ({
    ...jest.requireActual('@box/box-ai-agent-selector'),
    BoxAiAgentSelectorWithApi: () => <div data-testid="sidebar-agent-selector" />
}));

const mockOnClearAction = jest.fn();
jest.mock('@box/box-ai-content-answers', () => ({
    ...jest.requireActual('@box/box-ai-content-answers'),
    withApiWrapper: Component => props => (<Component 
        createSession={props.createSessionRequest}
        encodedSession={props.restoredSession}
        error={null}
        getAIStudioAgents={props.getAIStudioAgents}
        hostAppName={props.hostAppName}
        hasCustomSuggestedQuestions={false}
        isAgentSelectorEnabled={props.isAgentSelectorEnabled}
        isAIStudioAgentSelectorEnabled={props.isAIStudioAgentSelectorEnabled}
        isCitationsEnabled={props.isCitationsEnabled}
        isDebugModeEnabled={props.isDebugModeEnabled}
        isMarkdownEnabled={props.isMarkdownEnabled}
        isLoading={false}
        isOpen
        isResetChatEnabled={props.isResetChatEnabled}
        isStreamingEnabled={props.isStreamingEnabled}
        itemID={props.itemID}
        itemIDs={props.itemIDs}
        onClearAction={mockOnClearAction}
        onCloseModal={jest.fn()}
        onSelectAgent={jest.fn()}
        onAgentEditorToggle={jest.fn()}
        questions={props.restoredQuestions}
        retryQuestion={jest.fn()}
        sendQuestion={jest.fn()}
        shouldRenderProviders={jest.fn()}
        stopQuestion={jest.fn()}
        suggestedQuestionsRequestState="success"
        suggestedQuestions={props.suggestedQuestions}
        warningNotice={props.warningNotice}
        warningNoticeAriaLabel={props.warningNoticeAriaLabel}
        />),
}));

describe('elements/content-sidebar/BoxAISidebar', () => {
    const mockProps = {
        contentName: 'testName.txt',
        cache: { encodedSession: '', questions: [] },
        createSessionRequest: jest.fn(()=> ({ encodedSession: '1234' })),
        elementId: '123',
        fetchTimeout: {},
        fileExtension: 'txt',
        fileID: '123',
        getAgentConfig: jest.fn(),
        getAIStudioAgents: jest.fn(() => ([
            {
                id: null,
                name: "Default agent",
                isSelected: true,
            },
            {
                id: "special",
                name: "Special agent",
                isSelected: false,
            },
        ])),
        getAnswer: jest.fn(),
        getAnswerStreaming: jest.fn(),
        getSuggestedQuestions: jest.fn(),
        hostAppName: 'appName',
        isAgentSelectorEnabled: false,
        isAIStudioAgentSelectorEnabled: true,
        isCitationsEnabled: true,
        isDebugModeEnabled: true,
        isIntelligentQueryMode: true,
        isMarkdownEnabled: true,
        isResetChatEnabled: true,
        isStopResponseEnabled: true,
        isStreamingEnabled: true,
        userInfo: { name: 'Test', avatarUrl: undefined},
        recordAction: jest.fn(),
        setCacheValue: jest.fn(),
    } as unknown as BoxAISidebarProps;

    const renderComponent = async (props = {}) => {
        await React.act(async () => {
            render(<BoxAISidebar {...mockProps} {...props} />);
        });
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render title', async () => {
        await renderComponent();
        

        expect(screen.getByRole('heading', { level: 3, name: 'Box AI' })).toBeInTheDocument();
    });

    test('should have accessible Agent selector if isAIStudioAgentSelectorEnabled is true', async () => {
        await renderComponent();

        expect(screen.queryByTestId('sidebar-agent-selector')).toBeInTheDocument();
    });

    test('should not have accessible Agent selector if isAIStudioAgentSelectorEnabled is false', async () => {
        await renderComponent({ isAIStudioAgentSelectorEnabled: false });

        expect(screen.queryByTestId('sidebar-agent-selector')).not.toBeInTheDocument();
    });

    test('should have accessible "Clear" button', async () => {
        await renderComponent();

        expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
    });

    test('should not have accessible "Clear" button if isResetChatEnabled is false', async () => {
        await renderComponent({ isResetChatEnabled: false });

        expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
    });

    test('should call onClearClick when click "Clear" button', async () => {
        await renderComponent();

        const expandButton = screen.getByRole('button', { name: 'Clear' });
        await userEvent.click(expandButton);

        expect(mockOnClearAction).toHaveBeenCalled();
    });

    test('should initialize session', async () => {
        await renderComponent();

        expect(mockProps.createSessionRequest).toHaveBeenCalled();
    });

    test('should render welcome message', async () => {
        await renderComponent();

        expect(screen.getByText('Welcome to Box AI')).toBeInTheDocument();
    });

    test('should not set questions that are in progress', async () => {
        await renderComponent({
            cache: { 
                encodedSession: '1234',
                questions: [
                    {
                        error: 'general',
                        isCompleted: true,
                        prompt: 'completed question',
                    },
                    {
                        error: 'general',
                        isCompleted: false,
                        prompt: 'not completed question',
                    }
                ]
            }
        });

        expect(screen.getByText('completed question')).toBeInTheDocument();
        expect(screen.queryByText('not completed question')).not.toBeInTheDocument();
    });

    test('should display clear conversation tooltip', async () => {
        await renderComponent();

        const button = screen.getByRole('button', { name: 'Clear' });
        await userEvent.hover(button);
        const tooltip = await screen.findByRole('tooltip', { name: 'Clear conversation' });

        expect(tooltip).toBeInTheDocument();
    });
});
