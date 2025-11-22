/**
 * @flow
 * @file Sidebar Additional Tab FTUX tooltip
 * @author Box
 */

import * as React from 'react';
import { Tooltip as BPTooltip } from '@box/blueprint-web';
import Tooltip from '../../common/Tooltip';
import TargetedClickThroughGuideTooltip from '../../../features/targeting/TargetedClickThroughGuideTooltip';
import { useFeatureConfig } from '../../common/feature-checking';
import type { AdditionalSidebarTabFtuxData } from '../flowTypes';
import './AdditionalTabTooltip.scss';

type Props = {
    children: React.Node,
    defaultTooltipText: ?string | React.Node,
    ftuxTooltipData?: AdditionalSidebarTabFtuxData,
    isFtuxVisible: boolean,
};

const AdditionalTabTooltip = ({ children, defaultTooltipText, isFtuxVisible, ftuxTooltipData }: Props) => {
    const { enabled: isPreviewModernizationEnabled } = useFeatureConfig('previewModernization');

    if (!isFtuxVisible || !ftuxTooltipData || !ftuxTooltipData.targetingApi().canShow) {
        if (isPreviewModernizationEnabled) {
            return (
                <BPTooltip content={defaultTooltipText} side="left">
                    {/* Workaround to attach BP tooltip to legacy button */}
                    <span>{children}</span>
                </BPTooltip>
            );
        }

        return (
            <Tooltip position="middle-left" text={defaultTooltipText}>
                {children}
            </Tooltip>
        );
    }

    const { targetingApi, text } = ftuxTooltipData;

    return (
        <TargetedClickThroughGuideTooltip
            className="bdl-AdditionalTabTooltip"
            body={text}
            position="middle-right"
            shouldTarget
            useTargetingApi={targetingApi}
        >
            {children}
        </TargetedClickThroughGuideTooltip>
    );
};

export default AdditionalTabTooltip;
