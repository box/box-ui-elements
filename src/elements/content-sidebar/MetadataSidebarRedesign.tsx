/**
 * @file Redesigned Metadata sidebar component
 * @author Box
 */
import * as React from 'react';
import flow from 'lodash/flow';
import { FormattedMessage } from 'react-intl';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { ORIGIN_METADATA_SIDEBAR_REDESIGN } from '../../constants';
import messages from '../common/messages';

import './MetadataSidebarRedesign.scss';

function MetadataSidebarRedesign() {
    return (
        <div className="bcs-MetadataSidebarRedesign">
            <h3>
                <FormattedMessage {...messages.sidebarMetadataTitle} />
            </h3>
            <hr />
            <p>Hello from Metadata Sidebar redesign</p>
        </div>
    );
}

export { MetadataSidebarRedesign as MetadataSidebarRedesignComponent };
export default flow([
    withLogger(ORIGIN_METADATA_SIDEBAR_REDESIGN),
    withErrorBoundary(ORIGIN_METADATA_SIDEBAR_REDESIGN),
    withAPIContext,
])(MetadataSidebarRedesign);
