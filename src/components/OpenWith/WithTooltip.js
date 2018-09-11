/**
 * @flow
 * @file HOC to conditionally add a tooltip
 * @author Box
 */

import * as React from 'react';
import Tooltip from 'box-react-ui/lib/components/tooltip/Tooltip';

const WithTooltip = ({
    tooltipText,
    position,
    children,
}: {
    tooltipText?: ?string | React.Node,
    position: string,
    children: React.Node,
}) =>
    tooltipText ? (
        <Tooltip text={tooltipText} position={position}>
            {children}
        </Tooltip>
    ) : (
        children
    );

export default WithTooltip;
