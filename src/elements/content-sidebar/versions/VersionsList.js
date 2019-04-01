/**
 * @flow
 * @file Versions List component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import VersionsItem from './VersionsItem';
import './VersionsList.scss';

type Props = {
    permissions: BoxItemPermission,
    versions: Array<BoxItemVersion>,
};

const VersionsList = ({ permissions, versions = [] }: Props) => {
    if (!versions.length) {
        return (
            <div className="bcs-VersionsList bcs-is-empty">
                <FormattedMessage {...messages.versionsEmpty} />
            </div>
        );
    }

    return (
        <ul className="bcs-VersionsList">
            {versions.map((version, index) => (
                <li className="bcs-VersionsList-item" key={version.id}>
                    <VersionsItem isCurrent={index === 0} permissions={permissions} version={version} />
                </li>
            ))}
        </ul>
    );
};

export default VersionsList;
