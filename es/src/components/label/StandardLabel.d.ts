import * as React from 'react';
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
declare const StandardLabel: ({ children, tooltip, ...rest }: StandardLabelProps) => React.JSX.Element;
export default StandardLabel;
