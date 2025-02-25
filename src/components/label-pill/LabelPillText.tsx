import * as React from 'react';
import classNames from 'classnames';

export interface LabelPillTextProps {
    /** Text content, ie string or FormattedMessage */
    children: React.ReactNode;
    /** Additional CSS classname(s) */
    className?: string;
}

const LabelPillText = ({ children, className, ...rest }: LabelPillTextProps) => (
    <span className={classNames('bdl-LabelPill-textContent', className)} {...rest}>
        {children}
    </span>
);

export default LabelPillText;
