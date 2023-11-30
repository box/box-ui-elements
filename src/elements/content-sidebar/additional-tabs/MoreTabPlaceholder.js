/**
 * @flow
 * @file Preview sidebar more tabs loading component
 * @author Box
 */

import * as React from 'react';
import { bdlGray10 } from '../../../styles/variables';
import IconEllipsis from '../../../icons/general/IconEllipsis';

const MoreTabPlaceholder = () => {
    return (
        <div className="bdl-AdditionalTabPlaceholder">
            <IconEllipsis className="bdl-AdditionalTabPlaceholder-moreIcon" color={bdlGray10} />
        </div>
    );
};

export default MoreTabPlaceholder;
