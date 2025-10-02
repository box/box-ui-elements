import * as React from 'react';
export interface HiddenLabelProps {
    /** Child for the label */
    children: React.ReactElement;
    /** Text content of the label */
    labelContent: React.ReactNode;
    /** Optional props for the label element */
    labelElProps?: React.ComponentPropsWithoutRef<'label'>;
}
declare const HiddenLabel: ({ children, ...rest }: HiddenLabelProps) => React.JSX.Element;
export default HiddenLabel;
