// @flow
import * as React from 'react';
import { bdlGray62 } from '../../styles/variables';
import AccessibleSVG from '../accessible-svg';

type Props = {
    className?: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const MetadataDefaultBadge = ({ className = '', height = 16, title, width = 16 }: Props) => (
    <AccessibleSVG
        className={`metadata-default-badge ${className}`}
        height={height}
        title={title}
        viewBox="0 0 16 16"
        width={width}
    >
        <g fill="none" fillRule="evenodd">
            <circle cx="8" cy="8" fill="none" r="7.5" stroke={bdlGray62} />
            <path
                d="M5.126 10.545a.57.57 0 0 1-.693.437.603.603 0 0 1-.416-.728l1.143-4.8c.122-.513.772-.62 1.039-.172L8 8.308l1.801-3.026c.267-.449.917-.34 1.039.173l1.143 4.8a.603.603 0 0 1-.416.727.57.57 0 0 1-.693-.437l-.817-3.43-1.572 2.643a.557.557 0 0 1-.97 0L5.943 7.116l-.817 3.43z"
                fill={bdlGray62}
            />
        </g>
    </AccessibleSVG>
);

export default MetadataDefaultBadge;
