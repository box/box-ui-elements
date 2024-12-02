/**
 * @file Redesigned Metadata sidebar component
 * @author Box
 */
import * as React from 'react';
import flow from 'lodash/flow';
import { useIntl } from 'react-intl';

import { ArrowsExpand } from '@box/blueprint-web-assets/icons/Fill';
import { BoxAiAgentSelector, REQUEST_STATE } from '@box/box-ai-agent-selector';
import {IconButton, Text} from '@box/blueprint-web';
import { Trash } from '@box/blueprint-web-assets/icons/Line';
import SidebarContent from './SidebarContent';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { ORIGIN_BOXAI_SIDEBAR, SIDEBAR_VIEW_BOXAI } from '../../constants';
import { EVENT_JS_READY } from '../common/logger/constants';
import { mark } from '../../utils/performance';

import messages from '../common/messages';
import sidebarMessages from './messages';
import './BoxAISidebar.scss';

const MARK_NAME_JS_READY: string = `${ORIGIN_BOXAI_SIDEBAR}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

export interface BoxAISidebarProps {
    onClearCLick: () => void;
    onExpandClick: () => void;
}

function BoxAISidebar({ onClearCLick, onExpandClick }: BoxAISidebarProps) {
    const { formatMessage } = useIntl();

    const renderBoxAISidebarTitle = () => {
        return (
            <div className="bcs-BoxAISidebar-title-part">
                <Text as="h3" className="bcs-title">
                    {formatMessage(messages.sidebarBoxAITitle)}
                </Text>
                <BoxAiAgentSelector
                    agents={[]}
                    onErrorAction={() => null}
                    requestState={REQUEST_STATE.SUCCESS}
                    selectedAgent={null}
                    triggerChipClassName="sidebar-chip"
                    data-testid="agent-selector"
                />
            </div>
        );
    };

    const renderChatActionButtons = () => {
        return (
            <div className="bcs-BoxAISidebar-chat-actions">
                <IconButton
                    aria-label={formatMessage(sidebarMessages.boxAISidebarClear)}
                    icon={Trash}
                    onClick={onClearCLick}
                    size="x-small"
                />
                <IconButton
                    aria-label={formatMessage(sidebarMessages.boxAISidebarExpand)}
                    className="bcs-BoxAISidebar-expand"
                    icon={ArrowsExpand}
                    onClick={onExpandClick}
                    size="x-small"
                />
            </div>
        );
    };

    const renderActions = () => (
        <>
            {renderBoxAISidebarTitle()}
            {renderChatActionButtons()}
        </>
    );

    return (
        <SidebarContent actions={renderActions()} className="bcs-BoxAISidebar" sidebarView={SIDEBAR_VIEW_BOXAI}>
            <div className="bcs-BoxAISidebar-content" />
        </SidebarContent>
    );
}

export { BoxAISidebar as BoxAISidebarComponent };

const BoxAISidebarDefaultExport: typeof withAPIContext = flow([
    withLogger(ORIGIN_BOXAI_SIDEBAR),
    withErrorBoundary(ORIGIN_BOXAI_SIDEBAR),
    withAPIContext,
])(BoxAISidebar);

export default BoxAISidebarDefaultExport;
