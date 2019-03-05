/**
 * @flow
 * @file Versions Sidebar component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import BackButton from '../../common/back-button';
import messages from '../../common/messages';
import SidebarContent from '../SidebarContent';
import './VersionsSidebar.scss';

type Props = {
    error?: string,
    versions: Array<any>,
};

const VersionsSidebar = ({ error, versions }: Props) => (
    <SidebarContent
        className="bcs-versions"
        title={
            <React.Fragment>
                <BackButton />
                <FormattedMessage {...messages.sidebarVersionsTitle} />
            </React.Fragment>
        }
    >
        {error || versions.map(version => version.id)}
    </SidebarContent>
);

export default VersionsSidebar;
