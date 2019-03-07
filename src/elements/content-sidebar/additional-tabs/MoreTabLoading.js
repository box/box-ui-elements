/**
 * @flow
 * @file Preview sidebar more tabs loading component
 * @author Box
 */

import * as React from 'react';
import './AdditionalTabs.scss';
import IconEllipsis from '../../../icons/general/IconEllipsis';

const MoreTabLoading = () => {
    return (
        <div className="bcs-additional-tab-loading-item">
            <IconEllipsis className="bcs-additional-tab-more-loading-icon" />
        </div>
    );
};

export default MoreTabLoading;
