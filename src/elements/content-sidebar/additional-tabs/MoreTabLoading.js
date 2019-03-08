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
        <div className="bdl-AdditionalTabLoading-item">
            <IconEllipsis className="bdl-AdditionalTabLoading-moreIcon" />
        </div>
    );
};

export default MoreTabLoading;
