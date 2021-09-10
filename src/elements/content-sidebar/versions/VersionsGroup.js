/**
 * @flow
 * @file Versions Group component
 * @author Box
 */

import React from 'react';
import VersionsList from './VersionsList';
import type { BoxItemVersion } from '../../../common/types/core';
import './VersionsGroup.scss';

type Props = {
    fileId: string,
    heading: string,
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
