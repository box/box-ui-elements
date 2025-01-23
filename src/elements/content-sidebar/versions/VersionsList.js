/**
 * @file Versions List component
 * @author Box
 */

import * as React from 'react';
import CustomRoute from '../../common/routing/customRoute';
import VersionsItem from './VersionsItem';
import './VersionsList.scss';

/**
 * @typedef {Object} Props
 * @property {string} [currentId]
 * @property {string} fileId
 * @property {number} versionCount
 * @property {number} versionLimit
 * @property {Array<import('../../../common/types/core').BoxItemVersion>} versions
 */

/** @type {React.FC<Props>} */
const VersionsList = ({ currentId, versions, ...rest }) => (
    <ul className="bcs-VersionsList">
        {versions.map(version => (
            <li className="bcs-VersionsList-item" key={version.id}>
                <CustomRoute
                    render={({ match }) => (
                        <VersionsItem
                            isCurrent={currentId === version.id}
                            isSelected={match?.params?.versionId === version.id}
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
