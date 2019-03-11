/**
 * @flow
 * @file Preview sidebar more tabs loading component
 * @author Box
 */

import * as React from 'react';
import { eees } from '../../../styles/variables';
import IconEllipsis from '../../../icons/general/IconEllipsis';
import './AdditionalTabs.scss';

const MoreTabLoading = () => {
    return (
        <div className="bdl-AdditionalTabLoading">
            <IconEllipsis color={eees} className="bdl-AdditionalTabLoading-icon" />
        </div>
    );
};

export default MoreTabLoading;
