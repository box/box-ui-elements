// @flow
import * as React from 'react';

import AccessibleSVG from '../accessible-svg';
import { lightestCharcoal } from '../../styles/variables';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconCollections = ({ className = '', color = lightestCharcoal, height = 32, title, width = 32 }: Props) => (
    <AccessibleSVG
        className={`icon-collections ${className}`}
        height={height}
        title={title}
        viewBox="0 0 26 26"
        width={width}
    >
        <path
            fill={color}
            fillRule="nonzero"
            d="M6.45 0h17.554C25.106 0 26 .894 26 1.996V19.55a1.996 1.996 0 0 1-1.996 1.997H6.45a1.996 1.996 0 0 1-1.997-1.997V1.996A1.998 1.998 0 0 1 6.451 0zm.5 19.05h16.555V2.495H6.95V19.05zm-5.68-8.277c.676 0 1.224.548 1.224 1.224v9.511c0 1.103.894 1.997 1.997 1.997h9.51a1.224 1.224 0 1 1 0 2.448H4.04A3.993 3.993 0 0 1 .047 21.96v-9.963c0-.676.548-1.224 1.224-1.224z"
        />
    </AccessibleSVG>
);

export default IconCollections;
