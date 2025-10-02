import * as React from 'react';
export interface LabelPrimitiveProps {
    /** Child for the label */
    children: React.ReactElement;
    /** Custom class for the label */
    className?: string;
    /** Text content of the label */
    labelContent: React.ReactNode;
    /** Optional props for the label element */
    labelElProps?: React.ComponentPropsWithoutRef<'label'>;
}
declare const LabelPrimitive: ({ children, className, labelContent, labelElProps, ...rest }: LabelPrimitiveProps) => React.JSX.Element;
export default LabelPrimitive;
