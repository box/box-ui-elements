/**
 * @flow
 * @file Wrapper to conditionally add a tooltip
 * @author Box
 */

import * as React from 'react';
import TooltipCore from '../../components/tooltip/Tooltip';

const Tooltip = ({
    children,
    isDisabled,
    text,
    ...rest
}: {
    children: React.Node,
    isDisabled?: boolean,
    text?: ?string | React.Node,
}) => {
    if (isDisabled || !text) {
        return children;
    }

    return (
        <TooltipCore text={text} {...rest}>
            {children}
        </TooltipCore>
    );
};

export default Tooltip;
