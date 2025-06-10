import React from 'react';
import { userEvent } from '@testing-library/user-event';
import { render, screen } from '../../../test-utils/testing-library';
import BoxAISidebar, { BoxAISidebarProps } from '../BoxAISidebar';

let MockBoxAiAgentSelectorWithApi: jest.Mock;
let mockUseAgents: jest.Mock;

jest.mock('@box/box-ai-agent-selector', () => {
    MockBoxAiAgentSelectorWithApi = jest.fn();
    mockUseAgents = jest.fn();
    return {
        ...jest.requireActual('@box/box-ai-agent-selector'),
        BoxAiAgentSelectorWithApi: MockBoxAiAgentSelectorWithApi,
        useAgents: mockUseAgents,
    };
});

const mockOnClearAction = jest.fn();
jest.mock('@box/box-ai-content-answers', () => ({
    ...jest.requireActual('@box/box-ai-content-answers'),
    // BoxAiContentAnswers: jest.fn().mockImplementation(() => <div data-testid="content-answers" />),
    withApiWrapper: Component => props => (
        <Component
            cachedSuggestedQuestions={props.cachedSuggestedQuestions}
            createSession={props.createSessionRequest}
            encodedSession={props.restoredSession}
            error={null}
            getAIStudioAgents={props.getAIStudioAgents}
            getSuggestedQuestions={props.getSuggestedQuestions}
            hostAppName={props.hostAppName}
            isAgentSelectorEnabled={props.isAgentSelectorEnabled}
            isAIStudioAgentSelectorEnabled={props.isAIStudioAgentSelectorEnabled}
            isCitationsEnabled={props.isCitationsEnabled}
            isDebugModeEnabled={props.isDebugModeEnabled}
            isMarkdownEnabled={props.isMarkdownEnabled}
            isLoading={props.isLoading}
            isOpen
            isResetChatEnabled={props.isResetChatEnabled}
            isStreamingEnabled={props.isStreamingEnabled}
            itemID={props.itemID}
            itemIDs={props.itemIDs}
            onClearAction={mockOnClearAction}
            onCloseModal={jest.fn()}
            onSelectAgent={jest.fn()}
            onSelectedAgentCallback={props.onSelectedAgentCallback}
            onSuggestedQuestionsFetched={props.onSuggestedQuestionsFetched}
            onAgentEditorToggle={jest.fn()}
            questions={props.restoredQuestions}
            restoredShouldShowLandingPage={props.restoredShouldShowLandingPage}
            retryQuestion={jest.fn()}
            sendQuestion={props.sendQuestion}
            shouldPreinitSession={props.shouldPreinitSession}
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
            shouldShowLandingPage: true,
            suggestedQuestions: [],
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
        isLoading: false,
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
        isFeedbackFormEnabled: true,
        isIntelligentQueryMode: true,
        isMarkdownEnabled: true,
        isResetChatEnabled: true,
        isStopResponseEnabled: true,
        isStreamingEnabled: true,
        onFeedbackFormSubmit: jest.fn(),
        onUserInteraction: jest.fn(),
        recordAction: jest.fn(),
        sendQuestion: jest.fn(),
        setCacheValue: jest.fn(),
        shouldFeedbackFormIncludeFeedbackText: false,
        shouldPreinitSession: true,
        setHasQuestions: jest.fn(),
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

    beforeEach(() => {
        MockBoxAiAgentSelectorWithApi.mockImplementation(() => <div data-testid="sidebar-agent-selector" />);
        mockUseAgents.mockReturnValue({
            agents: [],
            selectedAgent: { id: '1', config: {}, name: 'Test Agent' },
            setSelectedAgent: jest.fn(),
            requestState: 'success',
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

    test('should call setHasQuestions with "false" on load if questions are empty', async () => {
        await renderComponent();

        expect(mockProps.setHasQuestions).toHaveBeenCalledWith(false);
    });

    test('should call setHasQuestions with "true" on load if questions are not empty', async () => {
        await renderComponent({
            cache: {
                encodedSession: '1234',
                questions: [
                    {
                        error: 'general',
                        isCompleted: true,
                        prompt: 'completed question',
                    },
                ],
                agents: mockAgents,
                shouldShowLandingPage: false,
                suggestedQuestions: [],
            },
        });

        expect(mockProps.setHasQuestions).toHaveBeenCalledWith(true);
    });

    test('should call onClearClick when click "Clear" button', async () => {
        await renderComponent();

        const expandButton = screen.getByRole('button', { name: 'Clear conversation' });
        await userEvent.click(expandButton);

        expect(mockOnClearAction).toHaveBeenCalled();
    });

    test('should pre-initialize session', async () => {
        await renderComponent();

        expect(mockProps.createSessionRequest).toHaveBeenCalled();
    });

    test('should not pre-initialize session when shouldPreinitSession = false', async () => {
        await renderComponent({ shouldPreinitSession: false });

        expect(mockProps.createSessionRequest).not.toHaveBeenCalled();
    });

    test('should render welcome message', async () => {
        await renderComponent();
        expect(screen.getByText('Welcome to Box AI', { exact: false })).toBeInTheDocument();
    });

    test('should render cached custom suggested questions', async () => {
        await renderComponent({
            cache: {
                encodedSession: '1234',
                questions: [],
                agents: mockAgents,
                shouldShowLandingPage: true,
                suggestedQuestions: [
                    {
                        id: 'suggested-question-1',
                        prompt: 'Summarize this document',
                        label: 'Please summarize this document',
                    },
                ],
            },
            getSuggestedQuestions: jest.fn(),
        });

        expect(screen.getByText('Summarize this document', { exact: false })).toBeInTheDocument();
        expect(screen.queryByText('Loading suggested questions', { exact: false })).not.toBeInTheDocument();
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
                shouldShowLandingPage: false,
                suggestedQuestions: [],
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

    describe('remote sidebar component', () => {
        const MockRemoteSidebar = jest.fn(() => <div data-testid="remote-sidebar" />);
        const renderRemoteModule = jest.fn(() => <MockRemoteSidebar elementId={mockProps.elementId} />);

        test('should render remote sidebar component when provided', async () => {
            await renderComponent({ renderRemoteModule });

            expect(renderRemoteModule).toHaveBeenCalledWith(mockProps.elementId);
            expect(screen.getByTestId('remote-sidebar')).toBeInTheDocument();
        });

        test('should not render default sidebar when remote component is provided', async () => {
            await renderComponent({ renderRemoteModule });

            expect(screen.queryByTestId('boxai-sidebar-title')).not.toBeInTheDocument();
            expect(screen.queryByTestId('sidebar-agent-selector')).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'Clear conversation' })).not.toBeInTheDocument();
        });
    });

    describe('given shouldPreinitSession = false, should create session on user intent', () => {
        test('agents list open', async () => {
            MockBoxAiAgentSelectorWithApi.mockImplementation(({ onAgentsListOpen }) => {
                onAgentsListOpen();
                return <div data-testid="sidebar-agent-selector" />;
            });

            await renderComponent({ shouldPreinitSession: false });

            expect(mockProps.createSessionRequest).toHaveBeenCalled();
        });

        test('content answers user action', async () => {
            await renderComponent({ shouldPreinitSession: false });

            const input = screen.getByTestId('content-answers-question-input');
            input.focus();
            await userEvent.keyboard('foo');

            expect(mockProps.createSessionRequest).toHaveBeenCalled();
        });
    });

    describe('given shouldPreinitSession = false, should not create session on user intent', () => {
        test.each`
            encodedSession | isLoading
            ${'123'}       | ${true}
            ${null}        | ${true}
            ${'123'}       | ${false}
        `(
            'agents list open when encodedSession = $encodedSession and isLoading = $isLoading',
            async ({ encodedSession, isLoading }) => {
                MockBoxAiAgentSelectorWithApi.mockImplementation(({ onAgentsListOpen }) => {
                    onAgentsListOpen();
                    return <div data-testid="sidebar-agent-selector" />;
                });

                await renderComponent({ restoredSession: encodedSession, isLoading, shouldPreinitSession: false });

                expect(mockProps.createSessionRequest).not.toHaveBeenCalled();
            },
        );

        test.each`
            encodedSession | isLoading
            ${'123'}       | ${true}
            ${null}        | ${true}
            ${'123'}       | ${false}
        `(
            'content answers user action when encodedSession = $encodedSession and isLoading = $isLoading',
            async ({ encodedSession, isLoading }) => {
                await renderComponent({
                    cache: { ...mockProps.cache, encodedSession },
                    isLoading,
                    shouldPreinitSession: false,
                });

                const input = screen.getByTestId('content-answers-question-input');
                input.focus();
                await userEvent.keyboard('foo');

                expect(mockProps.createSessionRequest).not.toHaveBeenCalled();
            },
        );
    });

    test('given shouldPreinitSession = false, should send question when encodedSession is available and last question is loading', async () => {
        const mockSendQuestion = jest.fn();

        await renderComponent({
            cache: {
                ...mockProps.cache,
                encodedSession: '123',
                questions: [
                    {
                        error: null,
                        isCompleted: false,
                        isLoading: true,
                        prompt: 'foo',
                    },
                ],
            },
            sendQuestion: mockSendQuestion,
            shouldPreinitSession: false,
        });

        expect(mockSendQuestion).toHaveBeenCalled();
    });

    test.each`
        encodedSession | isLoading
        ${'123'}       | ${false}
        ${null}        | ${true}
        ${null}        | ${false}
    `(
        'given shouldPreinitSession = false, should not send question when encodedSession = $encodedSession and last question loading state = $isLoading',
        async ({ encodedSession, isLoading }) => {
            const mockSendQuestion = jest.fn();

            await renderComponent({
                cache: {
                    ...mockProps.cache,
                    encodedSession,
                    questions: [
                        {
                            error: null,
                            isCompleted: !isLoading,
                            isLoading,
                            prompt: 'foo',
                        },
                    ],
                },
                sendQuestion: mockSendQuestion,
                shouldPreinitSession: false,
            });

            expect(mockSendQuestion).not.toHaveBeenCalled();
        },
    );

    test('should call onUserInteraction when user takes action', async () => {
        await renderComponent();

        const input = screen.getByTestId('content-answers-question-input');
        input.focus();
        await userEvent.keyboard('foo');

        expect(mockProps.onUserInteraction).toHaveBeenCalled();
    });

    test('Should call onSelectedAgentCallback on agent selected change', async () => {
        const mockOnSelectedAgentCallback = jest.fn();

        await renderComponent({
            onSelectedAgentCallback: mockOnSelectedAgentCallback,
        });

        expect(mockOnSelectedAgentCallback).toHaveBeenCalled();
    });
});
