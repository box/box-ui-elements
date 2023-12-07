import * as React from 'react';

import Tooltip, { TooltipPosition } from '../tooltip';
import LabelPrimitive from './LabelPrimitive';

export interface StandardLabelProps {
    /** Child for the label */
    children: React.ReactElement;
    /** Text content of the label */
    labelContent: React.ReactNode;
    /** Optional tooltip text for the label */
    tooltip?: React.ReactNode;
    /** Optional peopierties for label element */
    labelElProps?: Object;
}

const StandardLabel = ({ children, labelElProps, labelContent, tooltip }: StandardLabelProps) => {
    const label = (
        <LabelPrimitive labelElProps={labelElProps} labelContent={labelContent}>
            {children}
        </LabelPrimitive>
    );

    return tooltip ? (
        <Tooltip position={TooltipPosition.TOP_RIGHT} text={tooltip}>
            {label}
        </Tooltip>
    ) : (
        label
    );
};

export default StandardLabel;
