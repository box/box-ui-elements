import * as React from 'react';

import LabelPrimitive from './LabelPrimitive';

export interface HiddenLabelProps {
    /** Child for the label */
    children: React.ReactElement;
    /** Text content of the label */
    labelContent: React.ReactNode;
    /** Optional props for the label element */
    labelElProps?: React.ComponentPropsWithoutRef<'label'>;
}

const HiddenLabel = ({ children, ...rest }: HiddenLabelProps) => (
    <LabelPrimitive className="accessibility-hidden" {...rest}>
        {children}
    </LabelPrimitive>
);

export default HiddenLabel;
