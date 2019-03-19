/**
 * @flow
 * @file Preview sidebar more tabs loading component
 * @author Box
 */

import * as React from 'react';
import { eees } from '../../../styles/variables';
import IconEllipsis from '../../../icons/general/IconEllipsis';
import './AdditionalTabs.scss';

const MoreTabPlaceholder = () => {
    return (
        <div className="bdl-AdditionalTabPlaceholder">
            <IconEllipsis color={eees} className="bdl-AdditionalTabPlaceholder-moreIcon" />
        </div>
    );
};

export default MoreTabPlaceholder;
