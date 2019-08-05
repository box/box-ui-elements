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

const IconAnyTask = ({ className = '', color = bdlGray62, height = 10, title, width = 11 }: Props) => (
    <AccessibleSVG className={className} height={height} title={title} viewBox="0 0 11 10" width={width}>
        <g fill="none" fillRule="evenodd">
            <path
                d="M9.8571701 4.87513643c0 .34510262.25583119.62486357.57141495.62486357S11 5.22023905 11 4.87513643V1.12595504c0-.50631882-.52181991-.80241628-.90039552-.51091349l-.85712242.6599833c-.25803393.19868584-.31992213.5884963-.13823118.87066603.17173192.26670315.49960538.34178318.75291923.18144038v2.54800517z"
                fill={color}
                fillRule="nonzero"
            />
            <g stroke={color} strokeWidth="1.25">
                <path d="M4.5 4.625c1.03553391 0 1.875-.83946609 1.875-1.875C6.375 1.71446609 5.53553391.875 4.5.875c-1.03553391 0-1.875.83946609-1.875 1.875 0 1.03553391.83946609 1.875 1.875 1.875z" />
                <path
                    d="M8.3985 8.75075C7.59482244 7.35750088 6.1084279 6.49934967 4.5 6.49999954 2.89057161 6.49927666 1.40337248 7.35842016.6 8.753"
                    strokeLinecap="round"
                />
            </g>
        </g>
    </AccessibleSVG>
);

export default IconAnyTask;
