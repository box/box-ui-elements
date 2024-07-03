/**
 * @file Redesigned Metadata sidebar component
 * @author Box
 */
import * as React from 'react';
import flow from 'lodash/flow';
import { FormattedMessage } from 'react-intl';
// @ts-ignore Module is written in Flow
// eslint-disable-next-line import/named
import { withAPIContext } from '../common/api-context';
// @ts-ignore Module is written in Flow
// eslint-disable-next-line import/named
import { withErrorBoundary } from '../common/error-boundary';
// @ts-ignore Module is written in Flow
// eslint-disable-next-line import/named
import { withLogger } from '../common/logger';
// @ts-ignore Module is written in Flow
import { ORIGIN_METADATA_SIDEBAR_REDESIGN } from '../../constants';
// @ts-ignore Module is written in Flow
import messages from '../common/messages';

import './MetadataSidebarRedesigned.scss';

function MetadataSidebarRedesigned() {
    return (
        <div className="bcs-metadata-redesign">
            <h3>
                <FormattedMessage {...messages.sidebarMetadataTitle} />
            </h3>
            <hr />
            <p>Hello from Metadata Sidebar redesign</p>
        </div>
    );
}

export { MetadataSidebarRedesigned as MetadataSidebarRedesignedComponent };
export default flow([
    withLogger(ORIGIN_METADATA_SIDEBAR_REDESIGN),
    withErrorBoundary(ORIGIN_METADATA_SIDEBAR_REDESIGN),
    withAPIContext,
])(MetadataSidebarRedesigned);
