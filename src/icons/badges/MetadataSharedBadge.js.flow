// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';

type Props = {
    className?: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const MetadataSharedBadge = ({ className = '', height = 16, title, width = 16 }: Props) => (
    <AccessibleSVG
        className={`metadata-shared-badge ${className}`}
        height={height}
        title={title}
        viewBox="0 0 16 16"
        width={width}
    >
        <g fill="none" fillRule="evenodd">
            <circle cx="8" cy="8" fill="#D9E7F9" r="7.5" stroke="#4D91E2" />
            <path
                d="M10.715 7A2.57 2.57 0 0 1 13 9.605v1.145a.25.25 0 0 1-.25.25h-3.5a.25.25 0 0 1-.25-.25V9.5a2.465 2.465 0 0 0-.38-1.34.25.25 0 0 1 0-.3A2.5 2.5 0 0 1 10.715 7zm-.215-.5a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm-5 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm-.245.5A2.5 2.5 0 0 1 8 9.5v1.25a.25.25 0 0 1-.25.25h-4.5a.25.25 0 0 1-.25-.25V9.605A2.575 2.575 0 0 1 5.255 7z"
                fill="#4F92DF"
            />
        </g>
    </AccessibleSVG>
);

export default MetadataSharedBadge;
