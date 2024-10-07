/**
 * @file Redesigned Metadata sidebar component
 * @author Box
 */
import * as React from 'react';
import flow from 'lodash/flow';
import { useIntl } from 'react-intl';

import { ArrowsExpand } from '@box/blueprint-web-assets/icons/Fill';
import { IconButton } from '@box/blueprint-web';
import SidebarContent from './SidebarContent';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { ORIGIN_BOXAI_SIDEBAR, SIDEBAR_VIEW_BOXAI } from '../../constants';
import { EVENT_JS_READY } from '../common/logger/constants';
import { mark } from '../../utils/performance';

import messages from '../common/messages';
import './BoxAISidebar.scss';

const MARK_NAME_JS_READY: string = `${ORIGIN_BOXAI_SIDEBAR}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

export interface BoxAISidebarProps {
    onExpandPressed: () => void;
}

function BoxAISidebar({ onExpandPressed }: BoxAISidebarProps) {
    const { formatMessage } = useIntl();

    return (
        <SidebarContent
            className={'bcs-BoxAISidebar'}
            sidebarView={SIDEBAR_VIEW_BOXAI}
            title={formatMessage(messages.sidebarBoxAITitle)}
            actions={
                <IconButton
                    onClick={onExpandPressed}
                    icon={ArrowsExpand}
                    aria-label={formatMessage(messages.expand)}
                    size="x-small"
                />
            }
        >
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
