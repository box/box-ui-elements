/**
 * @flow
 * @file BoxAI sidebar component
 */

import * as React from 'react';
import flow from 'lodash/flow';
import { FormattedMessage } from 'react-intl';
import messages from '../common/messages';
import SidebarContent from './SidebarContent';
import { EVENT_JS_READY } from '../common/logger/constants';
import { mark } from '../../utils/performance';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { ORIGIN_BOXAI_SIDEBAR, SIDEBAR_VIEW_BOXAI } from '../../constants';

type Props = {
    onExpandPressed: () => void,
    logger: any,
};

const MARK_NAME_JS_READY = `${ORIGIN_BOXAI_SIDEBAR}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

class BoxAISidebar extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);
        const { logger } = this.props;
        logger.onReadyMetric({
            endMarkName: MARK_NAME_JS_READY,
        });
    }

    render() {
        return (
            <SidebarContent
                className={'bcs-BoxAISidebar'}
                sidebarView={SIDEBAR_VIEW_BOXAI}
                title={<FormattedMessage {...messages.sidebarBoxAITitle} />}
            >
                <div className="bcs-BoxAISidebar-content"></div>
            </SidebarContent>
        );
    }
}

export type BoxAISidebarProps = Props;
export { BoxAISidebar as BoxAISidebarComponent };
export default flow([withLogger(ORIGIN_BOXAI_SIDEBAR), withErrorBoundary(ORIGIN_BOXAI_SIDEBAR), withAPIContext])(
    BoxAISidebar,
);
