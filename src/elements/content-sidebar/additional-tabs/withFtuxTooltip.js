/**
 * @flow
 * @file Sidebar Additional Tab FTUX tooltip HOC
 * @author Box
 */

import * as React from 'react';

import AdditionalTabFtuxTooltip from './AdditionalTabFtuxTooltip';
import type { AdditionalSidebarTabFtuxData } from '../flowTypes';

type Props = {
    ftuxTooltipData?: AdditionalSidebarTabFtuxData,
    isLoading: boolean,
};

const withFtuxTooltip = (WrappedComponent: React.ComponentType<any>) => {
    const AdditionalTabFtuxTooltipComponent = ({ ftuxTooltipData, isLoading, ...rest }: Props) => {
        if (!ftuxTooltipData || isLoading) {
            return <WrappedComponent {...rest} isLoading={isLoading} />;
        }

        return (
            <AdditionalTabFtuxTooltip {...ftuxTooltipData}>
                <WrappedComponent {...rest} isLoading={isLoading} />
            </AdditionalTabFtuxTooltip>
        );
    };

    return AdditionalTabFtuxTooltipComponent;
};

export default withFtuxTooltip;
