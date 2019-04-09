// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';
import type { TwoTonedIcon } from '../flowTypes';

const IconTaskApproval = ({ className = '', height = 24, title, width = 24 }: TwoTonedIcon) => (
    <AccessibleSVG className={className} height={height} title={title} viewBox="0 0 20 20" width={width}>
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g transform="translate(1.000000, 1.000000)" fillRule="nonzero">
                <circle className="background-color" stroke="#FFFFFF" fill="#F5B31B" cx="9" cy="9" r="9.5" />
                <g className="foreground-color" transform="translate(4.500000, 3.000000)" fill="#FFFFFF">
                    <path d="M6.33748102,3.66175758 C5.70042437,4.92277116 5.39902565,6.06704494 5.42957549,7.0944082 C5.43312774,7.21386706 5.33018985,7.3125 5.20196482,7.3125 L4.5,7.3125 L3.79803518,7.3125 C3.66981015,7.3125 3.56687226,7.21386706 3.57042451,7.0944082 C3.60097435,6.06704494 3.29957563,4.92277116 2.66251898,3.66175758 C1.66114814,1.67960696 2.5633313,1.37680828e-15 4.5,0 C6.4366687,1.37680828e-15 7.33885186,1.67960696 6.33748102,3.66175758 Z" />
                    <rect x="0" y="8.06470588" width="9" height="1.88602941" rx="0.943014706" />
                    <rect x="0.642857143" y="10.5794118" width="7.71428571" height="1" rx="0.5" />
                </g>
            </g>
        </g>
    </AccessibleSVG>
);

export default IconTaskApproval;
