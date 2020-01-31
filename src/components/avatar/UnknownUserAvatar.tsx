import * as React from 'react';
import AccessibleSVG, { SVGProps } from '../accessible-svg/AccessibleSVG';

const UnknownUserAvatar = ({ className = '', height = 28, title, width = 28 }: SVGProps) => (
    <AccessibleSVG
        className={`unknown-user-avatar ${className}`}
        height={height}
        title={title}
        viewBox="0 0 28 28"
        width={width}
    >
        <circle cx="14" cy="14" fill="#ededed" r="14" />
        <path
            d="M5.5 25.1C6.7 21 10 18 14 18s7.3 3 8.5 7.1a14 14 0 0 1-17 0zM14 16a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"
            fill="#c3c3c3"
        />
    </AccessibleSVG>
);

export default UnknownUserAvatar;
