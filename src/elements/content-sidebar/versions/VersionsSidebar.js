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
    versions: Array<any>,
};

class VersionsSidebar extends React.Component<Props> {
    props: Props;

    title = 'test';

    render() {
        return (
            <SidebarContent
                className="bcs-versions"
                title={
                    <React.Fragment>
                        <BackButton />
                        <FormattedMessage {...messages.sidebarVersionsTitle} />
                    </React.Fragment>
                }
            >
                {this.props.versions.map(version => version.id)}
            </SidebarContent>
        );
    }
}

export default VersionsSidebar;
