import * as React from 'react';
import classNames from 'classnames';

export interface LabelPrimitiveProps {
    /** Child for the label */
    children: React.ReactElement;
    /** Custom class for the label */
    className?: string;
    /** Text content of the label */
    labelContent: React.ReactNode;
}

const LabelPrimitive = ({ children, className, labelContent, ...rest }: LabelPrimitiveProps) => (
    <label>
        <span className={classNames('label bdl-Label', className)} {...rest}>
            {labelContent}
        </span>
        {children}
    </label>
);

export default LabelPrimitive;
