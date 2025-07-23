import React from 'react';

import { useIntl } from 'react-intl';

import { SIDEBAR_VIEW_REDACT_WIZARD } from '../../constants';
import SidebarContent from './SidebarContent';
import messages from '../common/messages';
import './RedactWizardSidebar.scss';

export interface RedactWizardSidebarProps {
    elementId: string;
    fileId: string;
    hasSidebarInitialized?: boolean;
}

const RedactWizardSidebar = ({ elementId }: RedactWizardSidebarProps) => {
    const { formatMessage } = useIntl();

    return (
        <SidebarContent
            // actions={metadataDropdown}
            className={'bcs-RedactWizardSidebar'}
            elementId={elementId}
            sidebarView={SIDEBAR_VIEW_REDACT_WIZARD}
            title={formatMessage(messages.sidebarRedactWizardTitle)}
            // subheader={filterDropdown}
        >
            <div className="bcs-RedactWizardSidebar-content">Big things have small beginnings</div>
        </SidebarContent>
    );
};

export default RedactWizardSidebar;
