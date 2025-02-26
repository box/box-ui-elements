import * as React from 'react';

import Tooltip from '../../components/tooltip';

import './SandboxBanner.scss';

type Props = {
    children: React.ReactNode;
};

const SandboxBanner = ({ children }: Props) => {
    return (
        <Tooltip text={children}>
            <div className="bdl-SandboxBanner">
                <div className="bdl-SandboxBanner-text">{children}</div>
            </div>
        </Tooltip>
    );
};

export default SandboxBanner;
