import * as React from 'react';

import './SandboxBanner.scss';

type Props = {
    children: React.ReactNode;
};

const SandboxBanner = ({ children }: Props) => {
    return (
        <div className="bdl-SandboxBanner">
            <span className="bdl-SandboxBanner-text">{children}</span>
        </div>
    );
};

export default SandboxBanner;
