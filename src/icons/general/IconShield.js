// @flow
import * as React from 'react';

import classNames from 'classnames';
import AccessibleSVG from '../accessible-svg';
import { boxBlue, white } from '../../styles/variables';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    opacity?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconShieldProduct = ({ className, color = boxBlue, height = 62, opacity = 0.2, width = 53, title }: Props) => (
    <AccessibleSVG
        className={classNames('bdl-IconShieldProduct', className)}
        height={height}
        title={title}
        viewBox="0 0 53 62"
        width={width}
    >
        <g fill="none" fillRule="evenodd">
            <path
                fill={white}
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5.615S13.75 12.923 26.5 1C39.25 12.923 52 5.615 52 5.615v40.962L26.5 61 1 46.577V5.615z"
            />
            <path fill={color} fillOpacity={opacity} d="M26 7c-10.5 9.538-21 3.692-21 3.692v32.77L26 55V7z" />
            <path stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M44 19v20" />
        </g>
    </AccessibleSVG>
);

export default IconShieldProduct;
