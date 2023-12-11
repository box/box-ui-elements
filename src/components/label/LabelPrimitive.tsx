import * as React from 'react';
import classNames from 'classnames';

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

const LabelPrimitive = ({ children, className, labelContent, labelElProps, ...rest }: LabelPrimitiveProps) => (
    <label {...labelElProps}>
        <span className={classNames('label bdl-Label', className)} {...rest}>
            {labelContent}
        </span>
        {children}
    </label>
);

export default LabelPrimitive;
