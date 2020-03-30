import * as React from 'react';

import LabelPrimitive from './LabelPrimitive';

export interface HiddenLabelProps {
    /** Child for the label */
    children: React.ReactElement;
    /** Text content of the label */
    labelContent: React.ReactNode;
}

const HiddenLabel = ({ children, labelContent }: HiddenLabelProps) => (
    <LabelPrimitive className="accessibility-hidden" labelContent={labelContent}>
        {children}
    </LabelPrimitive>
);

export default HiddenLabel;
