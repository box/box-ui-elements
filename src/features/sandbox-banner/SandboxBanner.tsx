import * as React from 'react';

import Tooltip from '../../components/tooltip';

import './SandboxBanner.scss';

type Props = {
    children: React.ReactChild;
};

const SandboxBanner = ({ children }: Props) => {
    return (
        <Tooltip targetWrapperClassName="bdl-SandboxBanner" text={children}>
            <div className="bdl-SandboxBanner-text">{children}</div>
        </Tooltip>
    );
};

export default SandboxBanner;
