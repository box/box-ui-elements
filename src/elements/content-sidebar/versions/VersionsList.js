/**
 * @flow
 * @file Versions List component
 * @author Box
 */

import React from 'react';
import { Route } from 'react-router-dom';
import VersionsItem from './VersionsItem';
import type { BoxItemVersion } from '../../../common/types/core';
import './VersionsList.scss';

type Props = {
    currentId?: string,
    fileId: string,
    versionCount: number,
    versionLimit: number,
    versions: Array<BoxItemVersion>,
};

const VersionsList = ({ currentId, versions, ...rest }: Props) => (
    <ul className="bcs-VersionsList">
        {versions.map(version => (
            <li className="bcs-VersionsList-item" key={version.id}>
                <Route
                    render={({ match }) => (
                        <VersionsItem
                            isCurrent={currentId === version.id}
                            isSelected={match.params.versionId === version.id}
                            version={version}
                            {...rest}
                        />
                    )}
                />
            </li>
        ))}
    </ul>
);

export default VersionsList;
