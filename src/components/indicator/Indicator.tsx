import * as React from 'react';

import './Indicator.scss';

type Props = {
    children: React.ReactNode;
};

const Indicator = ({ children }: Props) => {
    return (
        <div className="bdl-Indicator">
            <span className="bdl-Indicator-text">{children}</span>
        </div>
    );
};

export default Indicator;
