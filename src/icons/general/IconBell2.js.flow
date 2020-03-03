// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';
import { white } from '../../styles/variables';

type Props = {
    className?: string,
    color?: string,
    /** Should this icon be filled, or just an outline */
    height?: number,
    isFilled?: boolean,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconBell2 = ({ className = '', color = white, isFilled = false, height = 18, title, width = 18 }: Props) => (
    <AccessibleSVG
        className={`icon-bell-2 ${className}`}
        title={title}
        width={width}
        height={height}
        viewBox="0 0 18 18"
    >
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <path
                d="M9.41464715,16.5 L6.58535285,16.5 C6.79127106,17.0825962 7.34689059,17.5 8,17.5 C8.65310941,17.5 9.20872894,17.0825962 9.41464715,16.5 Z M0.5,14.5 L15.5,14.5 L15.5,14.0046997 C15.5,13.8733992 15.4473922,13.6340309 15.291882,13.398171 C15.1728517,13.2176395 15.0067082,13.0679879 14.7737982,12.9531918 L14.6667807,12.8989034 C14.0028928,12.5621229 13.5,11.7419044 13.5,10.9906311 L13.5,8 C13.5,4.89865954 12.1772561,3.03042465 9.88715663,2.48646538 L9.50270503,2.39514795 L9.50270503,2 C9.50270503,1.17726332 8.82497923,0.5 8.00342974,0.5 C7.18077307,0.5 6.5,1.17836622 6.5,2 L6.5,2.40700549 L6.10146256,2.48959713 C3.65098807,2.99742572 2.5,4.72245944 2.5,8 L2.5,10.9906311 C2.5,11.7342689 1.99034639,12.5638438 1.33333313,12.8923504 L1.2272329,12.9454001 C1.00044577,13.0591697 0.834016979,13.2089567 0.714171653,13.3883298 C0.554039261,13.6280007 0.5,13.8706432 0.5,14.0038757 L0.5,14.5 Z"
                stroke={color}
                fill={isFilled ? color : 'none'}
                transform="translate(1 0)"
            />
        </g>
    </AccessibleSVG>
);

export default IconBell2;
