/**
 * @file Box AI sidebar component
 * @author Box
 */
import * as React from 'react';
import flow from 'lodash/flow';
import isEqual from 'lodash/isEqual';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { BoxAiAgentSelectorWithApi, useAgents } from '@box/box-ai-agent-selector';
import { IconButton, Tooltip } from '@box/blueprint-web';
import { ArrowsExpand } from '@box/blueprint-web-assets/icons/Fill';
import {
    BoxAiContentAnswers,
    ClearConversationButton,
    IntelligenceModal,
    withApiWrapper,
    type ApiWrapperWithInjectedProps,
} from '@box/box-ai-content-answers';
import SidebarContent from './SidebarContent';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { ORIGIN_BOXAI_SIDEBAR, SIDEBAR_VIEW_BOXAI } from '../../constants';
import { EVENT_JS_READY } from '../common/logger/constants';
import { mark } from '../../utils/performance';
import { BoxAISidebarContext } from './context/BoxAISidebarContext';
import BoxAISidebarTitle from './BoxAISidebarTitle';

import messages from '../common/messages';

import './BoxAISidebar.scss';

const MARK_NAME_JS_READY: string = `${ORIGIN_BOXAI_SIDEBAR}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

function BoxAISidebarContent(props: ApiWrapperWithInjectedProps & { shouldShowLandingPage: boolean }) {
    const {
        createSession,
        encodedSession,
        onClearAction,
        getAIStudioAgents,
        hasRequestInProgress,
        hostAppName,
        isAIStudioAgentSelectorEnabled,
        isLoading,
        isResetChatEnabled,
        onSelectAgent,
        questions,
        shouldShowLandingPage,
        sendQuestion,
        stopQuestion,
        ...rest
    } = props;
    const { formatMessage } = useIntl();
    const isSessionInitiated = React.useRef<boolean>(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const {
        cache,
        contentName,
        elementId,
        fileExtension,
        isFeedbackEnabled,
        isFeedbackFormEnabled,
        isStopResponseEnabled,
        items,
        itemSize,
        onFeedbackFormSubmit,
        onUserInteraction,
        recordAction,
        setCacheValue,
        shouldFeedbackFormIncludeFeedbackText,
        shouldPreinitSession,
    } = React.useContext(BoxAISidebarContext);
    const { agents, requestState, selectedAgent } = useAgents();
    const { questions: cacheQuestions } = cache;

    if (cache.shouldShowLandingPage !== shouldShowLandingPage) {
        setCacheValue('shouldShowLandingPage', shouldShowLandingPage);
    }

    if (cache.encodedSession !== encodedSession) {
        setCacheValue('encodedSession', encodedSession);
    }

    if (!isEqual(cache.questions, questions)) {
        setCacheValue('questions', questions);
    }

    if (
        !isEqual(cache.agents?.selectedAgent, selectedAgent) ||
        !isEqual(cache.agents?.agents, agents) ||
        !isEqual(cache.agents?.requestState, requestState)
    ) {
        setCacheValue('agents', { agents, requestState, selectedAgent });
    }

    const handleUserIntentToUseAI = React.useCallback(
        (userHasInteracted: boolean = false) => {
            // Create session if not already created or loading
            if (!shouldPreinitSession && !encodedSession && !isLoading && createSession) {
                createSession(true, false);
            }
            if (userHasInteracted && onUserInteraction) {
                onUserInteraction();
            }
        },
        [shouldPreinitSession, encodedSession, isLoading, createSession, onUserInteraction],
    );

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleSwitchToModalClick = React.useCallback(() => {
        handleUserIntentToUseAI();
        setIsModalOpen(true);
    }, [handleUserIntentToUseAI]);

    React.useEffect(() => {
        if (shouldPreinitSession && !encodedSession && createSession) {
            createSession(true, true);
        }

        if (
            encodedSession &&
            cacheQuestions.length > 0 &&
            cacheQuestions[cacheQuestions.length - 1].isCompleted === false
        ) {
            // if we have cache with question that is not completed resend it to trigger an API
            sendQuestion({ prompt: cacheQuestions[cacheQuestions.length - 1].prompt });
        }

        if (recordAction) {
            recordAction({
                action: 'programmatic',
                component: 'sidebar',
                feature: 'answers',
                target: 'loaded',
                data: {
                    items: items.map(item => {
                        return { status: item.status, fileType: item.fileType };
                    }),
                },
            });
        }

        return () => {
            // stop API request on unmount (e.g. during switching to another tab)
            stopQuestion();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Resend the last question (if it was sent before session loaded) after (re-)initializing session
    React.useEffect(() => {
        const lastQuestion = cacheQuestions[cacheQuestions.length - 1];
        if (!shouldPreinitSession && !isSessionInitiated.current && encodedSession && lastQuestion?.isLoading) {
            sendQuestion(lastQuestion, selectedAgent, false);
            isSessionInitiated.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [encodedSession]);

    const renderBoxAISidebarTitle = React.useCallback(() => {
        return (
            <div className="bcs-BoxAISidebar-title-part">
                <BoxAISidebarTitle isAIStudioAgentSelectorEnabled={isAIStudioAgentSelectorEnabled} />
                {isAIStudioAgentSelectorEnabled && (
                    <div className="bcs-BoxAISidebar-agentSelector">
                        <BoxAiAgentSelectorWithApi
                            disabled={hasRequestInProgress}
                            fetcher={getAIStudioAgents}
                            hostAppName={hostAppName}
                            onAgentsListOpen={handleUserIntentToUseAI}
                            onSelectAgent={onSelectAgent}
                            recordAction={recordAction}
                            shouldHideAgentSelectorOnLoad
                            variant="sidebar"
                        />
                    </div>
                )}
            </div>
        );
    }, [
        isAIStudioAgentSelectorEnabled,
        hasRequestInProgress,
        getAIStudioAgents,
        hostAppName,
        handleUserIntentToUseAI,
        onSelectAgent,
        recordAction,
    ]);

    const renderActions = React.useCallback(
        () => (
            <>
                {renderBoxAISidebarTitle()}
                {isResetChatEnabled && <ClearConversationButton onClick={onClearAction} />}
                <Tooltip content={formatMessage(messages.sidebarBoxAISwitchToModalView)} variant="standard">
                    <IconButton
                        aria-label={formatMessage(messages.sidebarBoxAISwitchToModalView)}
                        className="bcs-BoxAISidebar-expand"
                        data-target-id="IconButton-expandBoxAISidebar"
                        icon={ArrowsExpand}
                        onClick={handleSwitchToModalClick}
                        size="small"
                    />
                </Tooltip>
            </>
        ),
        [renderBoxAISidebarTitle, isResetChatEnabled, onClearAction, formatMessage, handleSwitchToModalClick],
    );

    return (
        <>
            <SidebarContent
                actions={renderActions()}
                className={classNames('bcs-BoxAISidebar', { 'with-modal-open': isModalOpen })}
                elementId={elementId}
                sidebarView={SIDEBAR_VIEW_BOXAI}
            >
                <div className="bcs-BoxAISidebar-content">
                    <BoxAiContentAnswers
                        className="bcs-BoxAISidebar-contentAnswers"
                        contentName={contentName}
                        contentType={formatMessage(messages.sidebarBoxAIContent)}
                        hostAppName={hostAppName}
                        isAIStudioAgentSelectorEnabled={isAIStudioAgentSelectorEnabled}
                        isFeedbackEnabled={isFeedbackEnabled}
                        isFeedbackFormEnabled={isFeedbackFormEnabled}
                        isStopResponseEnabled={isStopResponseEnabled}
                        items={items}
                        questions={questions}
                        onFeedbackFormSubmit={onFeedbackFormSubmit}
                        onUserIntentToUseAI={handleUserIntentToUseAI}
                        shouldFeedbackFormIncludeFeedbackText={shouldFeedbackFormIncludeFeedbackText}
                        shouldShowLandingPage={cache.shouldShowLandingPage}
                        showLoadingIndicator={isLoading && shouldPreinitSession}
                        stopQuestion={stopQuestion}
                        submitQuestion={sendQuestion}
                        variant="sidebar"
                        recordAction={recordAction}
                        {...rest}
                    />
                </div>
            </SidebarContent>
            <IntelligenceModal
                contentName={contentName}
                contentType={formatMessage(messages.sidebarBoxAIContent)}
                extension={fileExtension}
                getAIStudioAgents={getAIStudioAgents}
                hasRequestInProgress={hasRequestInProgress}
                hostAppName={hostAppName}
                isAIStudioAgentSelectorEnabled={isAIStudioAgentSelectorEnabled}
                isFeedbackEnabled={isFeedbackEnabled}
                isFeedbackFormEnabled={isFeedbackFormEnabled}
                isResetChatEnabled={isResetChatEnabled}
                isStopResponseEnabled={isStopResponseEnabled}
                items={items}
                itemSize={itemSize}
                onClearAction={onClearAction}
                onFeedbackFormSubmit={onFeedbackFormSubmit}
                onOpenChange={handleModalClose}
                onSelectAgent={onSelectAgent}
                onUserIntentToUseAI={handleUserIntentToUseAI}
                open={isModalOpen}
                questions={questions}
                recordAction={isModalOpen ? recordAction : undefined}
                shouldFeedbackFormIncludeFeedbackText={shouldFeedbackFormIncludeFeedbackText}
                shouldShowLandingPage={cache.shouldShowLandingPage}
                showLoadingIndicator={false}
                stopPropagationOnEsc
                stopQuestion={stopQuestion}
                submitQuestion={sendQuestion}
                variant="collapsible"
                {...rest}
                shouldRenderProviders={false}
            />
        </>
    );
}

export { BoxAISidebarContent as BoxAISidebarComponent };

const BoxAISidebarContentDefaultExport: typeof withAPIContext = flow([
    withLogger(ORIGIN_BOXAI_SIDEBAR),
    withErrorBoundary(ORIGIN_BOXAI_SIDEBAR),
    withAPIContext,
    withApiWrapper, // returns only props for Box AI, keep it at the end
])(BoxAISidebarContent);

export default BoxAISidebarContentDefaultExport;
