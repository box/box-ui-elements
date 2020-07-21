/**
 * @flow
 * @file Sidebar Additional Tab FTUX tooltip
 * @author Box
 */

import * as React from 'react';
import TargetedClickThroughGuideTooltip from '../../../features/targeting/TargetedClickThroughGuideTooltip';
import type { UseTargetingApi } from '../../../features/targeting/types';
import './AdditionalTabFtuxTooltip.scss';

type Props = {
    children: React.Node,
    isVisible: boolean,
    targetingApi?: UseTargetingApi,
    text?: string,
};

const AdditionalTabFtuxTooltip = ({ children, isVisible, targetingApi, text }: Props) => {
    if (isVisible && targetingApi && text) {
        return (
            <TargetedClickThroughGuideTooltip
                className="bdl-AdditionalTabFtuxTooltip"
                body={text}
                position="middle-right"
                shouldTarget
                useTargetingApi={targetingApi}
            >
                {children}
            </TargetedClickThroughGuideTooltip>
        );
    }

    return children;
};

export default AdditionalTabFtuxTooltip;
