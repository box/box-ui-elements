/**
 * @file Box AI sidebar title component
 * @author Box
 */
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useAgents, REQUEST_STATE } from '@box/box-ai-agent-selector';
import { Text } from '@box/blueprint-web';

import messages from '../common/messages';

interface BoxAISidebarTitleProps {
    isAIStudioAgentSelectorEnabled?: boolean;
}

function BoxAISidebarTitle({ isAIStudioAgentSelectorEnabled = false }: BoxAISidebarTitleProps) {
    const { formatMessage } = useIntl();

    const { agents, requestState } = useAgents();

    const hasAgentSelectorRequestEnded =
        requestState !== REQUEST_STATE.NOT_STARTED && requestState !== REQUEST_STATE.IN_PROGRESS;
    const hasAgentSelectorRequestFailed =
        requestState === REQUEST_STATE.ERROR || requestState === REQUEST_STATE.CANCELLED;
    const isAgentSelectorVisible = agents.length > 1 && requestState === REQUEST_STATE.SUCCESS;

    // We want to display the title when the agent selector is disabled
    // or when the request has failed
    // or when the request has succeeded and the agent selector is not visible
    return !isAIStudioAgentSelectorEnabled ||
        hasAgentSelectorRequestFailed ||
        (!isAgentSelectorVisible && hasAgentSelectorRequestEnded) ? (
        <Text as="h3" className="bcs-title">
            {formatMessage(messages.sidebarBoxAITitle)}
        </Text>
    ) : null;
}

export default BoxAISidebarTitle;
