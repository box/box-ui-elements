/**
 * @flow
 * @file Sidebar Additional Tab FTUX tooltip
 * @author Box
 */

import * as React from 'react';
import TargetedClickThroughGuideTooltip from '../../../features/targeting/TargetedClickThroughGuideTooltip';
import type { AdditionalSidebarTabFtuxData } from '../flowTypes';
import './AdditionalTabFtuxTooltip.scss';

type Props = {
    children: React.Node,
    ftuxTooltipData?: AdditionalSidebarTabFtuxData,
    isVisible: boolean,
};

const AdditionalTabFtuxTooltip = ({ children, isVisible, ftuxTooltipData }: Props) => {
    if (!isVisible || !ftuxTooltipData) {
        return children;
    }

    const { targetingApi, text } = ftuxTooltipData;

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
};

export default AdditionalTabFtuxTooltip;
