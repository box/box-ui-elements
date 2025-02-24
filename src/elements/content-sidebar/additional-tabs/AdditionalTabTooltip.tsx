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

    const api = targetingApi?.();
    if (isFtuxVisible && text && api?.canShow) {
        if (api.onShow) {
            api.onShow();
        }

        return (
            <div className="bdl-AdditionalTabTooltip" data-testid="additional-tab-tooltip">
                <Tooltip
                    isShown
                    showCloseButton
                    text={<FormattedMessage {...{ id: text }} />}
                    position={TooltipPosition.MIDDLE_RIGHT}
                    theme={TooltipTheme.CALLOUT}
                >
                    {children}
                </Tooltip>
            </div>
        );
    }

    return (
        <div className="bdl-AdditionalTabTooltip" data-testid="additional-tab-tooltip">
            <Tooltip text={defaultTooltipText} position={TooltipPosition.MIDDLE_RIGHT}>
                {children}
            </Tooltip>
        </div>
    );
};

export default AdditionalTabTooltip;
