import * as React from 'react';
import Tooltip from '../../common/Tooltip';
import TargetedClickThroughGuideTooltip from '../../../features/targeting/TargetedClickThroughGuideTooltip';
import type { AdditionalSidebarTabFtuxData } from '../flowTypes';
import './AdditionalTabTooltip.scss';

interface Props {
    children: React.ReactNode;
    defaultTooltipText: React.ReactNode | null;
    ftuxTooltipData?: AdditionalSidebarTabFtuxData;
    isFtuxVisible: boolean;
}

const AdditionalTabTooltip = ({
    children,
    defaultTooltipText,
    isFtuxVisible,
    ftuxTooltipData,
}: Props): React.ReactElement => {
    if (!isFtuxVisible || !ftuxTooltipData || !ftuxTooltipData.targetingApi().canShow) {
        return (
            <Tooltip position="middle-right" text={defaultTooltipText}>
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
