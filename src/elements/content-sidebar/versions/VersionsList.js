/**
 * @flow
 * @file Versions List component
 * @author Box
 */

import React from 'react';
import { Route } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import VersionsItem from './VersionsItem';
import type { VersionActionCallback } from './Versions';
import './VersionsList.scss';

type Props = {
    isLoading: boolean,
    onDelete: VersionActionCallback,
    onPreview: VersionActionCallback,
    onPromote: VersionActionCallback,
    permissions: BoxItemPermission,
    versions: Array<BoxItemVersion>,
};

const VersionsList = ({ isLoading, onDelete, onPreview, onPromote, permissions, versions }: Props) => {
    if (!isLoading && !versions.length) {
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
                    <Route
                        render={({ match }) => (
                            <VersionsItem
                                isCurrent={index === 0}
                                isSelected={match.params.versionId === version.id}
                                onDelete={onDelete}
                                onPreview={onPreview}
                                onPromote={onPromote}
                                permissions={permissions}
                                version={version}
                            />
                        )}
                    />
                </li>
            ))}
        </ul>
    );
};

export default VersionsList;
