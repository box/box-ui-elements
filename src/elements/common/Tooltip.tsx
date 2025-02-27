/**
 * @file Wrapper to conditionally add a tooltip
 * @author Box
 */

import * as React from 'react';
import TooltipCore from '../../components/tooltip/Tooltip';

interface TooltipProps {
    children: React.ReactChild;
    isDisabled?: boolean;
    text?: string | React.ReactNode | null;
}

const Tooltip = ({ children, isDisabled, text, ...rest }: TooltipProps): React.ReactElement | React.ReactChild => {
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
