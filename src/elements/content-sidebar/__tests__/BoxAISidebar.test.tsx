import React from 'react';
import { userEvent } from '@testing-library/user-event';
import { render, screen } from '../../../test-utils/testing-library';
import BoxAISidebar, { BoxAISidebarProps } from '../BoxAISidebar';

jest.mock('@box/box-ai-agent-selector', () => ({
    ...jest.requireActual('@box/box-ai-agent-selector'),
    BoxAiAgentSelectorWithApi: () => <div data-testid="sidebar-agent-selector" />,
}));

const mockOnClearAction = jest.fn();
jest.mock('@box/box-ai-content-answers', () => ({
    ...jest.requireActual('@box/box-ai-content-answers'),
    withApiWrapper: Component => props => (
        <Component
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
        />
    ),
}));

jest.mock('../BoxAISidebarTitle', () => () => <div data-testid="boxai-sidebar-title" />);

describe('elements/content-sidebar/BoxAISidebar', () => {
    const mockAgents = {
        agents: [],
        requestState: 'success',
        selectedAgent: null,
    };

    const mockProps = {
        contentName: 'testName.txt',
        cache: {
            encodedSession: '',
            questions: [],
            agents: mockAgents,
        },
        createSessionRequest: jest.fn(() => ({ encodedSession: '1234' })),
        elementId: '123',
        fetchTimeout: {},
        fileExtension: 'txt',
        fileID: '123',
        getAgentConfig: jest.fn(),
        getAIStudioAgents: jest.fn(() => [
            {
                id: null,
                name: 'Default agent',
                isSelected: true,
            },
            {
                id: 'special',
                name: 'Special agent',
                isSelected: false,
            },
        ]),
        getAnswer: jest.fn(),
        getAnswerStreaming: jest.fn(),
        getSuggestedQuestions: jest.fn(),
        hostAppName: 'appName',
        items: [
            {
                id: '1',
                type: 'type',
                fileType: 'pdf',
                name: 'test.pdf',
                status: 'supported',
            },
        ],
        itemSize: '1234',
        isAgentSelectorEnabled: false,
        isAIStudioAgentSelectorEnabled: true,
        isCitationsEnabled: true,
        isDebugModeEnabled: true,
        isFeedbackEnabled: true,
        isIntelligentQueryMode: true,
        isMarkdownEnabled: true,
        isResetChatEnabled: true,
        isStopResponseEnabled: true,
        isStreamingEnabled: true,
        userInfo: { name: 'Test', avatarUrl: undefined },
        recordAction: jest.fn(),
        setCacheValue: jest.fn(),
    } as unknown as BoxAISidebarProps;

    const renderComponent = async (props = {}) => {
        await React.act(async () => {
            render(<BoxAISidebar {...mockProps} {...props} />);
        });
    };

    beforeAll(() => {
        // Required to pass Blueprint Interactivity test for buttons with tooltip
        Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
            get() {
                return this.parentNode;
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render BoxAISidebarTitle', async () => {
        await renderComponent();

        expect(screen.queryByTestId('boxai-sidebar-title')).toBeInTheDocument();
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

        expect(screen.getByRole('button', { name: 'Clear conversation' })).toBeInTheDocument();
    });

    test('should not have accessible "Clear" button if isResetChatEnabled is false', async () => {
        await renderComponent({ isResetChatEnabled: false });

        expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
    });

    test('should call recordAction on load if provided', async () => {
        const mockRecordAction = jest.fn();
        await renderComponent({ recordAction: mockRecordAction });

        expect(mockRecordAction).toHaveBeenCalledWith({
            action: 'programmatic',
            component: 'sidebar',
            feature: 'answers',
            target: 'loaded',
            data: {
                items: [{ fileType: 'pdf', status: 'supported' }],
            },
        });
    });

    test('should call onClearClick when click "Clear" button', async () => {
        await renderComponent();

        const expandButton = screen.getByRole('button', { name: 'Clear conversation' });
        await userEvent.click(expandButton);

        expect(mockOnClearAction).toHaveBeenCalled();
    });

    test('should initialize session', async () => {
        await renderComponent();

        expect(mockProps.createSessionRequest).toHaveBeenCalled();
    });

    test('should render welcome message', async () => {
        await renderComponent();
        expect(screen.getByText('Welcome to Box AI', { exact: false })).toBeInTheDocument();
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
                    },
                ],
                agents: mockAgents,
            },
        });

        expect(screen.getByText('completed question')).toBeInTheDocument();
        expect(screen.queryByText('not completed question')).not.toBeInTheDocument();
    });

    test('should display clear conversation tooltip', async () => {
        await renderComponent();

        const button = screen.getByRole('button', { name: 'Clear conversation' });
        await userEvent.hover(button);
        const tooltip = await screen.findByRole('tooltip', { name: 'Clear conversation' });

        expect(tooltip).toBeInTheDocument();
    });

    test('should have accessible "Switch to modal view" button', async () => {
        await renderComponent();

        expect(screen.getByRole('button', { name: 'Switch to modal view' })).toBeInTheDocument();
    });

    test('should display "Switch to modal view" tooltip', async () => {
        await renderComponent();

        const button = screen.getByRole('button', { name: 'Switch to modal view' });
        await userEvent.hover(button);
        const tooltip = await screen.findByRole('tooltip', { name: 'Switch to modal view' });

        expect(tooltip).toBeInTheDocument();
    });

    test('should open Intelligence Modal when clicking on "Switch to modal view" button and close when clicking "Switch to sidebar view"', async () => {
        await renderComponent();

        const switchToModalButton = screen.getByRole('button', { name: 'Switch to modal view' });
        await userEvent.click(switchToModalButton);

        expect(await screen.findByTestId('content-answers-modal')).toBeInTheDocument();

        const switchToSidebarButton = screen.getByRole('button', { name: 'Switch to sidebar view' });
        await userEvent.click(switchToSidebarButton);

        expect(screen.queryByTestId('content-answers-modal')).not.toBeInTheDocument();
    });
});
