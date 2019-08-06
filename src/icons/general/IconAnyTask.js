// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';
import { bdlGray62 } from '../../styles/variables';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    /** A text-only string describing the icon if it is not purely decorative for accessibility */
    title?: string,
    width?: number,
};

const IconAnyTask = ({ className = '', color = bdlGray62, height = 32, title, width = 32 }: Props) => (
    <AccessibleSVG className={className} height={height} title={title} viewBox="0 0 32 32" width={width}>
        <g fill="none" fillRule="evenodd">
            <path
                d="M27.67540377 16.7276696c0 1.0039349.74423617 1.8177849 1.66229802 1.8177849s1.66229803-.81385 1.66229803-1.8177849V5.82096012c0-1.47292748-1.51802156-2.33430192-2.61933242-1.48629379l-2.49344704 1.91995144c-.75064415.57799516-.93068258 1.71198921-.40212708 2.5328466.49958377.7758637 1.45339748.99427836 2.19031049.52782658v7.41237865z"
                fill={color}
                fillRule="nonzero"
            />
            <g stroke={color} strokeWidth="3.63636364">
                <path d="M12.0909091 16c3.0124623 0 5.4545454-2.44208318 5.4545454-5.45454545 0-3.01246228-2.4420831-5.45454546-5.4545454-5.45454546-3.01246228 0-5.45454546 2.44208318-5.45454546 5.45454546C6.63636364 13.55791682 9.07844682 16 12.0909091 16z" />
                <path
                    d="M23.432 28.0021818c-2.3379711-4.0530883-6.6620279-6.5495282-11.3410909-6.5476377-4.68197351-.0021029-9.00837099 2.4972236-11.34545455 6.5541832"
                    strokeLinecap="round"
                />
            </g>
        </g>
    </AccessibleSVG>
);

export default IconAnyTask;
