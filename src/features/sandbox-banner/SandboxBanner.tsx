import * as React from 'react';

import './SandboxBanner.scss';

type Props = {
    children: React.ReactChild;
};

const SandboxBanner = ({ children }: Props) => {
    return (
        <div className="bdl-SandboxBanner">
            <div className="bdl-SandboxBanner-text">{children}</div>
        </div>
    );
};

export default SandboxBanner;
