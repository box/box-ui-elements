import * as React from 'react';

import Tooltip, { TooltipPosition } from '../tooltip';
import LabelPrimitive from './LabelPrimitive';

export interface StandardLabelProps {
    /** Child for the label */
    children: React.ReactElement;
    /** Text content of the label */
    labelContent: React.ReactNode;
    /** Optional props for the label element */
    labelElProps?: React.ComponentPropsWithoutRef<'label'>;
    /** Optional tooltip text for the label */
    tooltip?: React.ReactNode;
}

const StandardLabel = ({ children, tooltip, ...rest }: StandardLabelProps) => {
    const label = <LabelPrimitive {...rest}>{children}</LabelPrimitive>;

    return tooltip ? (
        <Tooltip position={TooltipPosition.TOP_RIGHT} text={tooltip}>
            {label}
        </Tooltip>
    ) : (
        label
    );
};

export default StandardLabel;
