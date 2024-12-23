/**
 * @file Box AI sidebar component
 * @author Box
 */
import * as React from 'react';
import flow from 'lodash/flow';
import { useIntl } from 'react-intl';
import { AgentsProvider, BoxAiAgentSelectorWithApi } from '@box/box-ai-agent-selector';
import { IconButton, Text, Tooltip } from '@box/blueprint-web';
import { Trash } from '@box/blueprint-web-assets/icons/Line';
// @ts-expect-error - TS2305 - Module '"@box/box-ai-content-answers"' has no exported member 'ApiWrapperProps'.
import { BoxAiContentAnswers, withApiWrapper, type ApiWrapperProps } from '@box/box-ai-content-answers';
import SidebarContent from './SidebarContent';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { ORIGIN_BOXAI_SIDEBAR, SIDEBAR_VIEW_BOXAI } from '../../constants';
import { EVENT_JS_READY } from '../common/logger/constants';
import { mark } from '../../utils/performance';
import { BoxAISidebarContext } from './BoxAISidebar';

import messages from '../common/messages';
import sidebarMessages from './messages';

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
    const { cache, contentName, elementId, isStopResponseEnabled, recordAction, setCacheValue, userInfo } =
        React.useContext(BoxAISidebarContext);
    const { questions: cacheQuestions } = cache;

    if (cache.encodedSession !== encodedSession) {
        setCacheValue('encodedSession', encodedSession);
    }

    if (cache.questions !== questions) {
        setCacheValue('questions', questions);
    }

    React.useEffect(() => {
        if (!encodedSession && createSession) {
            createSession();
        }

        if (cacheQuestions.length > 0 && cacheQuestions[cacheQuestions.length - 1].isCompleted === false) {
            // if we have cache with question that is not completed resend it to trigger an API
            sendQuestion({ prompt: cacheQuestions[cacheQuestions.length - 1].prompt });
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
                <Text as="h3" className="bcs-title">
                    {formatMessage(messages.sidebarBoxAITitle)}
                </Text>
                {isAIStudioAgentSelectorEnabled && (
                    <BoxAiAgentSelectorWithApi
                        fetcher={getAIStudioAgents}
                        hostAppName={hostAppName}
                        onSelectAgent={onSelectAgent}
                        recordAction={recordAction}
                        shouldHideAgentSelectorOnLoad
                        // @ts-ignore variant will be available in higher version
                        variant="sidebar"
                    />
                )}
            </div>
        );
    };

    const renderActions = () => (
        <>
            {renderBoxAISidebarTitle()}
            {isResetChatEnabled && (
                <Tooltip content={formatMessage(sidebarMessages.boxAISidebarClearConversationTooltip)}>
                    <IconButton
                        aria-label={formatMessage(sidebarMessages.boxAISidebarClear)}
                        icon={Trash}
                        onClick={onClearAction}
                        size="small"
                    />
                </Tooltip>
            )}
        </>
    );

    return (
        <AgentsProvider>
            <SidebarContent
                actions={renderActions()}
                className="bcs-BoxAISidebar"
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
                        isStopResponseEnabled={isStopResponseEnabled}
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
