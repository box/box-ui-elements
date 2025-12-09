/**
 * @flow
 * @file Versions List component
 * @author Box
 */

import * as React from 'react';
import { Route } from 'react-router-dom';
import classNames from 'classnames';
import VersionsItem from './VersionsItem';
import { useFeatureConfig } from '../../common/feature-checking/hooks';
import type { BoxItemVersion } from '../../../common/types/core';
import type { InternalSidebarNavigation } from '../../common/types/SidebarNavigation';
import './VersionsList.scss';

type Props = {
    currentId?: string,
    fileId: string,
    internalSidebarNavigation?: InternalSidebarNavigation,
    routerDisabled?: boolean,
    versionCount: number,
    versionLimit: number,
    versions: Array<BoxItemVersion>,
};

const VersionsList = ({ currentId, internalSidebarNavigation, routerDisabled = false, versions, ...rest }: Props) => {
    const { enabled: isPreviewModernizationEnabled } = useFeatureConfig('previewModernization');

    const renderVersionItemWithoutRouter = (version: BoxItemVersion) => (
        <VersionsItem
            isCurrent={currentId === version.id}
            isSelected={internalSidebarNavigation?.versionId === version.id}
            version={version}
            {...rest}
        />
    );

    const renderVersionItemWithRouter = (version: BoxItemVersion) => (
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
    );

    return (
        <ul
            className={classNames('bcs-VersionsList', {
                'bcs-VersionsList--modernized': isPreviewModernizationEnabled,
            })}
        >
            {versions.map(version => (
                <li className="bcs-VersionsList-item" key={version.id}>
                    {routerDisabled ? renderVersionItemWithoutRouter(version) : renderVersionItemWithRouter(version)}
                </li>
            ))}
        </ul>
    );
};

export default VersionsList;
