import * as React from 'react';

import { useIsContentOverflowed } from '../../utils/dom';
import Tooltip from '../../components/tooltip';

import './SandboxBanner.scss';

type Props = {
    children: React.ReactChild;
};

const SandboxBanner = ({ children }: Props) => {
    const textRef = React.useRef<HTMLElement>(null);
    const isTextOverflowed = useIsContentOverflowed(textRef);

    return (
        <Tooltip isDisabled={!isTextOverflowed} text={children}>
            <div className="bdl-SandboxBanner">
                <div ref={textRef} className="bdl-SandboxBanner-text">
                    {children}
                </div>
            </div>
        </Tooltip>
    );
};

export default SandboxBanner;
