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
    targetingApi: UseTargetingApi,
    text: string,
};

const AdditionalTabFtuxTooltip = ({ children, targetingApi, text }: Props) => (
    <TargetedClickThroughGuideTooltip
        className="rec-app-ftux-tooltip"
        body={text}
        position="middle-right"
        shouldTarget
        useTargetingApi={targetingApi}
    >
        {children}
    </TargetedClickThroughGuideTooltip>
);

export default AdditionalTabFtuxTooltip;
