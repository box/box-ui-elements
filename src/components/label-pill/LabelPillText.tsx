import * as React from 'react';

export interface LabelPillTextProps {
    children: React.ReactChild;
}

const LabelPillText = ({ children }: LabelPillTextProps) => (
    <span className="bdl-LabelPill-textContent">{children}</span>
);

export default LabelPillText;
