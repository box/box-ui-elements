import * as React from 'react';
export interface LabelPillTextProps {
    /** Text content, ie string or FormattedMessage */
    children: React.ReactChild;
    /** Additional CSS classname(s) */
    className?: string;
}
declare const LabelPillText: ({ children, className, ...rest }: LabelPillTextProps) => React.JSX.Element;
export default LabelPillText;
