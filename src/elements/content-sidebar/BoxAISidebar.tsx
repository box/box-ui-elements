/**
 * @file Redesigned Metadata sidebar component
 * @author Box
 */
import * as React from 'react';
import flow from 'lodash/flow';
import { useIntl } from 'react-intl';

import {AgentType, BoxAiAgentSelector, REQUEST_STATE} from '@box/box-ai-agent-selector';
import { IconButton, Text } from '@box/blueprint-web';
import { Trash } from '@box/blueprint-web-assets/icons/Line';
import { BoxAiContentAnswers, withApiWrapper, type ApiWrapperProps } from '@box/box-ai-content-answers'
import SidebarContent from './SidebarContent';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { ORIGIN_BOXAI_SIDEBAR, SIDEBAR_VIEW_BOXAI } from '../../constants';
import { EVENT_JS_READY } from '../common/logger/constants';
import { mark } from '../../utils/performance';
import { useFeatureEnabled } from '../common/feature-checking';
import type { User } from '../../common/types/core';

import messages from '../common/messages';
import sidebarMessages from './messages';
import './BoxAISidebar.scss';


const MARK_NAME_JS_READY: string = `${ORIGIN_BOXAI_SIDEBAR}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

export interface BoxAISidebarProps extends ApiWrapperProps {
    currentUser: User,
    onClearClick: () => void;
    agents: AgentType[];
    selectedAgent: AgentType | null;
    fileName: string,
    contentType: string,
}

function BoxAISidebar({ agents = [], currentUser, fileName, onClearClick, selectedAgent, ...props }: BoxAISidebarProps) {
    const { formatMessage } = useIntl();
    const { createSession, encodedSession, sendQuestion } = props;
    const userInfo = { name: currentUser.name, avatarUrl: currentUser.avatar_url };
    const isAgentSelectorEnabled = useFeatureEnabled('boxai.agentSelector.enabled');

    React.useEffect(() => {
        if (!encodedSession && createSession) {
            createSession();
        }
    }, []);

    const renderBoxAISidebarTitle = () => {
        return (
            <div className="bcs-BoxAISidebar-title-part">
                <Text as="h3" className="bcs-title">
                    {formatMessage(messages.sidebarBoxAITitle)}
                </Text>
                {isAgentSelectorEnabled &&
                        <BoxAiAgentSelector
                            agents={agents}
                            onErrorAction={() => null}
                            requestState={REQUEST_STATE.SUCCESS}
                            selectedAgent={selectedAgent}
                            triggerChipClassName="sidebar-chip" />
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

    return (
        <SidebarContent actions={renderActions()} className="bcs-BoxAISidebar" sidebarView={SIDEBAR_VIEW_BOXAI}>
            <div className="bcs-BoxAISidebar-content">
                <BoxAiContentAnswers 
                    userInfo={userInfo} 
                    className="bcs-BoxAISidebar-contentAnswers" 
                    isSidebarOpen 
                    contentName={fileName} 
                    contentType={props.contentType} 
                    submitQuestion={sendQuestion} 
                    {...props} 
                />
            </div>
        </SidebarContent>
    );
}

export { BoxAISidebar as BoxAISidebarComponent };

const BoxAISidebarDefaultExport: typeof withAPIContext = flow([
    withApiWrapper,
    withLogger(ORIGIN_BOXAI_SIDEBAR),
    withErrorBoundary(ORIGIN_BOXAI_SIDEBAR),
    withAPIContext,
])(BoxAISidebar);

export default BoxAISidebarDefaultExport;
