/**
 * @flow
 * @file Wrapper to conditionally add a tooltip
 * @author Box
 */

import * as React from 'react';
import TooltipCore from 'box-react-ui/lib/components/tooltip/Tooltip';

const Tooltip = ({
    children,
    isEnabled,
    text,
    ...rest
}: {
    children: React.Node,
    isEnabled?: boolean,
    text?: string | React.Node,
}) => {
    if (!isEnabled || !text) {
        return children;
    }

    return (
        <TooltipCore text={text} {...rest}>
            {children}
        </TooltipCore>
    );
};

export default Tooltip;
