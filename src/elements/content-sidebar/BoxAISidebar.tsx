/**
 * @file Box AI sidebar component
 * @author Box
 */
import * as React from 'react';
import flow from 'lodash/flow';
import { useIntl } from 'react-intl';
import { AgentsProvider, BoxAiAgentSelectorWithApi } from '@box/box-ai-agent-selector';
import { IconButton, Text } from '@box/blueprint-web';
import { Trash } from '@box/blueprint-web-assets/icons/Line';
// @ts-expect-error - TS2305 - Module '"@box/box-ai-content-answers"' has no exported member 'ApiWrapperProps'.
import { BoxAiContentAnswers, withApiWrapper, type ApiWrapperProps } from '@box/box-ai-content-answers'
import SidebarContent from './SidebarContent';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { ORIGIN_BOXAI_SIDEBAR, SIDEBAR_VIEW_BOXAI } from '../../constants';
import { EVENT_JS_READY } from '../common/logger/constants';
import { mark } from '../../utils/performance';
import { useFeatureEnabled } from '../common/feature-checking';
import { BoxAISidebarContext } from './BoxAISidebarContainer';

import messages from '../common/messages';
import sidebarMessages from './messages';

import './BoxAISidebar.scss';


const MARK_NAME_JS_READY: string = `${ORIGIN_BOXAI_SIDEBAR}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);
    
function BoxAISidebar(props: ApiWrapperProps) {
    const { createSession, encodedSession, onClearClick, getAIStudioAgents, onSelectAgent, questions, sendQuestion, stopQuestion, ...rest } = props;
    const { formatMessage } = useIntl();
    const isAgentSelectorEnabled = useFeatureEnabled('boxai.agentSelector.enabled');
    const { cache, setCacheValue, elementId, userInfo, contentName } = React.useContext(BoxAISidebarContext);
    const { questions: cacheQuestions } = cache;

    React.useEffect(() => {
        if (!encodedSession && createSession) {
            createSession();
        }

        if (cacheQuestions.length > 0 && cacheQuestions[cacheQuestions.length-1].isCompleted === false) {
            // if we have cache with question that is not completed resend it to trigger an API
            sendQuestion({prompt: cacheQuestions[cacheQuestions.length-1].prompt});
        }

        return () => {
            // stop API request on unmount (e.g. during switching to another tab)
            stopQuestion();
        }
    }, []);

    const renderBoxAISidebarTitle = () => {
        return (
            <div className="bcs-BoxAISidebar-title-part">
                <Text as="h3" className="bcs-title">
                    {formatMessage(messages.sidebarBoxAITitle)}
                </Text>
                {isAgentSelectorEnabled &&
                    <BoxAiAgentSelectorWithApi
                        fetcher={getAIStudioAgents}
                        onSelectAgent={onSelectAgent}
                    />
                }
            </div>
        );
    };

    const renderActions = () => (
        <>
            {renderBoxAISidebarTitle()}
            <IconButton
                aria-label={formatMessage(sidebarMessages.boxAISidebarClear)}
                icon={Trash}
                onClick={onClearClick}
                size="x-small"
            />
        </>
    );
    
    if (!cache[encodedSession] && encodedSession) {
        setCacheValue('encodedSession', encodedSession);
    }

    if (!cache[questions] && questions) {
        setCacheValue('questions', questions);
    }

    return (
        <AgentsProvider>
            <SidebarContent actions={renderActions()} className="bcs-BoxAISidebar" elementId={elementId} sidebarView={SIDEBAR_VIEW_BOXAI}>
                <div className="bcs-BoxAISidebar-content">
                    <BoxAiContentAnswers 
                        userInfo={userInfo} 
                        className="bcs-BoxAISidebar-contentAnswers" 
                        contentName={contentName} 
                        questions={questions}
                        submitQuestion={sendQuestion} 
                        stopQuestion={stopQuestion}
                        variant="sidebar"
                        {...rest} 
                    />
                </div>
            </SidebarContent>
        </AgentsProvider>
    );
}

export { BoxAISidebar as BoxAISidebarComponent };

const BoxAISidebarDefaultExport: typeof withAPIContext = flow([
    withLogger(ORIGIN_BOXAI_SIDEBAR),
    withErrorBoundary(ORIGIN_BOXAI_SIDEBAR),
    withAPIContext,
    withApiWrapper, // returns only props for Box AI, keep it at the end
])(BoxAISidebar);

export default BoxAISidebarDefaultExport;
