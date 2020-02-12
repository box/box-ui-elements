import * as React from 'react';
import classNames from 'classnames';

export interface LabelPillTextProps {
    /** Text content, ie string or FormattedMessage */
    children: React.ReactChild;
    /** Additional CSS classname(s) */
    className?: string;
}

const LabelPillText = ({ children, className }: LabelPillTextProps) => (
    <span className={classNames('bdl-LabelPill-textContent', className)}>{children}</span>
);

export default LabelPillText;
