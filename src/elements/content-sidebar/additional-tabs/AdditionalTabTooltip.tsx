import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Tooltip, { TooltipPosition, TooltipTheme } from '../../../components/tooltip';
import { AdditionalSidebarTabFtuxData } from './types';
import './AdditionalTabTooltip.scss';

type TooltipText = string | React.ReactElement;

interface AdditionalTabTooltipProps {
    children: React.ReactElement;
    defaultTooltipText: TooltipText;
    ftuxTooltipData?: AdditionalSidebarTabFtuxData;
    isFtuxVisible?: boolean;
}

const AdditionalTabTooltip = ({
    children,
    defaultTooltipText,
    ftuxTooltipData,
    isFtuxVisible = false,
}: AdditionalTabTooltipProps) => {
    const text = ftuxTooltipData?.text;
    const targetingApi = ftuxTooltipData?.targetingApi;

    if (isFtuxVisible && text && targetingApi) {
        return (
            <Tooltip
                className="bdl-AdditionalTabTooltip"
                isShown
                showCloseButton
                text={<FormattedMessage {...{ id: text }} />}
                position={TooltipPosition.MIDDLE_RIGHT}
                theme={TooltipTheme.CALLOUT}
            >
                {children}
            </Tooltip>
        );
    }

    return (
        <Tooltip className="bdl-AdditionalTabTooltip" text={defaultTooltipText} position={TooltipPosition.MIDDLE_RIGHT}>
            {children}
        </Tooltip>
    );
};

export default AdditionalTabTooltip;
