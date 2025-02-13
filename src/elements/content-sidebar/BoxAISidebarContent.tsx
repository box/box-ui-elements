/**
 * @file Box AI sidebar component
 * @author Box
 */
import * as React from 'react';
import flow from 'lodash/flow';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { AgentsProvider, BoxAiAgentSelectorWithApi } from '@box/box-ai-agent-selector';
import { IconButton, Tooltip } from '@box/blueprint-web';
import { ArrowsExpand } from '@box/blueprint-web-assets/icons/Fill';
import {
    BoxAiContentAnswers,
    ClearConversationButton,
    IntelligenceModal,
    withApiWrapper,
    // @ts-expect-error - TS2305 - Module '"@box/box-ai-content-answers"' has no exported member 'ApiWrapperProps'.
    type ApiWrapperProps,
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

function BoxAISidebarContent(props: ApiWrapperProps) {
    const {
        createSession,
        encodedSession,
        onClearAction,
        getAIStudioAgents,
        hostAppName,
        isAIStudioAgentSelectorEnabled,
        isResetChatEnabled,
        onSelectAgent,
        questions,
        sendQuestion,
        stopQuestion,
        ...rest
    } = props;
    const { formatMessage } = useIntl();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const {
        cache,
        contentName,
        elementId,
        fileExtension,
        isFeedbackEnabled,
        isStopResponseEnabled,
        items,
        itemSize,
        recordAction,
        setCacheValue,
        userInfo,
    } = React.useContext(BoxAISidebarContext);
    const { questions: cacheQuestions } = cache;

    if (cache.encodedSession !== encodedSession) {
        setCacheValue('encodedSession', encodedSession);
    }

    if (cache.questions !== questions) {
        setCacheValue('questions', questions);
    }

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleSwitchToModalClick = () => {
        setIsModalOpen(true);
    };

    React.useEffect(() => {
        if (!encodedSession && createSession) {
            createSession();
        }

        if (cacheQuestions.length > 0 && cacheQuestions[cacheQuestions.length - 1].isCompleted === false) {
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

    const renderBoxAISidebarTitle = () => {
        return (
            <div className="bcs-BoxAISidebar-title-part">
                <BoxAISidebarTitle isAIStudioAgentSelectorEnabled={isAIStudioAgentSelectorEnabled} />
                {isAIStudioAgentSelectorEnabled && (
                    <div className="bcs-BoxAISidebar-agentSelector">
                        <BoxAiAgentSelectorWithApi
                            fetcher={getAIStudioAgents}
                            hostAppName={hostAppName}
                            onSelectAgent={onSelectAgent}
                            recordAction={recordAction}
                            shouldHideAgentSelectorOnLoad
                            variant="sidebar"
                        />
                    </div>
                )}
            </div>
        );
    };

    const renderActions = () => (
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
    );

    return (
        <AgentsProvider>
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
                            contentType={formatMessage(messages.sidebarBoxAIContent)}
                            hostAppName={hostAppName}
                            isAIStudioAgentSelectorEnabled={isAIStudioAgentSelectorEnabled}
                            isFeedbackEnabled={isFeedbackEnabled}
                            isStopResponseEnabled={isStopResponseEnabled}
                            items={items}
                            questions={questions}
                            stopQuestion={stopQuestion}
                            submitQuestion={sendQuestion}
                            userInfo={userInfo}
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
                    hostAppName={hostAppName}
                    isAIStudioAgentSelectorEnabled={isAIStudioAgentSelectorEnabled}
                    isFeedbackEnabled={isFeedbackEnabled}
                    isResetChatEnabled={isResetChatEnabled}
                    isStopResponseEnabled={isStopResponseEnabled}
                    items={items}
                    itemSize={itemSize}
                    onClearAction={onClearAction}
                    onOpenChange={handleModalClose}
                    onSelectAgent={onSelectAgent}
                    open={isModalOpen}
                    questions={questions}
                    recordAction={isModalOpen ? recordAction : undefined}
                    showLoadingIndicator={false}
                    stopPropagationOnEsc
                    submitQuestion={sendQuestion}
                    userInfo={userInfo}
                    variant="collapsible"
                    {...rest}
                    shouldRenderProviders={false}
                />
            </>
        </AgentsProvider>
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
