import * as React from 'react';

export interface LabelPillTextProps {
    /** Text content, ie string or FormattedMessage */
    children: React.ReactChild;
}

const LabelPillText = ({ children }: LabelPillTextProps) => (
    <span className="bdl-LabelPill-textContent">{children}</span>
);

export default LabelPillText;
