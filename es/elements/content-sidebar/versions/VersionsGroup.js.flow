/**
 * @flow
 * @file Versions Group component
 * @author Box
 */

import * as React from 'react';
import VersionsList from './VersionsList';
import type { BoxItemVersion } from '../../../common/types/core';
import type { InternalSidebarNavigation } from '../../common/types/SidebarNavigation';
import './VersionsGroup.scss';

type Props = {
    fileId: string,
    heading: string,
    internalSidebarNavigation?: InternalSidebarNavigation,
    routerDisabled?: boolean,
    versionCount: number,
    versionLimit: number,
    versions: Array<BoxItemVersion>,
};

const VersionsGroup = ({ heading, ...rest }: Props) => {
    return (
        <section className="bcs-VersionsGroup">
            <h4 className="bcs-VersionsGroup-heading">{heading}</h4>
            <VersionsList {...rest} />
        </section>
    );
};

export default VersionsGroup;
