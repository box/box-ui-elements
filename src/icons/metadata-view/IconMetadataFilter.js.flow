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

const IconMetadataFilter = ({ className = '', height = 16, title, width = 16 }: Props) => (
    <AccessibleSVG
        className={`metadata-filter ${className}`}
        height={height}
        title={title}
        viewBox="0 0 16 16"
        width={width}
    >
        <path d="M7 11h2v2H7v-2zM1 3h14v2H1V3zm3 4h8v2H4V7z" fill="#444" fillRule="nonzero" />
    </AccessibleSVG>
);

export default IconMetadataFilter;
