import * as React from 'react';
import classNames from 'classnames';

export interface LabelPillTextProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** Text content, ie string or FormattedMessage */
    children: React.ReactChild;
    /** Additional CSS classname(s) */
    className?: string;
}

const LabelPillText = ({ children, className, ...rest }: LabelPillTextProps) => (
    <span className={classNames('bdl-LabelPill-textContent', className)} {...rest}>
        {children}
    </span>
);

export default LabelPillText;
