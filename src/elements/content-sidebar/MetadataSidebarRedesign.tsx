/**
 * @file Redesigned Metadata sidebar component
 * @author Box
 */
import * as React from 'react';
import flow from 'lodash/flow';
import { FormattedMessage } from 'react-intl';

import { Text } from '@box/blueprint-web';
import { AddMetadataTemplateDropdown } from '@box/metadata-editor';

import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { ORIGIN_METADATA_SIDEBAR_REDESIGN } from '../../constants';
import { EVENT_JS_READY } from '../common/logger/constants';
import { mark } from '../../utils/performance';
import messages from '../common/messages';

import './MetadataSidebarRedesign.scss';

const MARK_NAME_JS_READY = `${ORIGIN_METADATA_SIDEBAR_REDESIGN}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

function MetadataSidebarRedesign() {
    return (
        <div className="bcs-MetadataSidebarRedesign bcs-content">
            <div className="bcs-MetadataSidebarRedesign-header">
                <Text as="h3" variant="titleLarge">
                    <FormattedMessage {...messages.sidebarMetadataTitle} />
                </Text>

                <AddMetadataTemplateDropdown
                    availableTemplates={[]}
                    selectedTemplates={[]}
                    onSelect={(): void => {
                        // nothing here yet
                    }}
                />
            </div>
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
