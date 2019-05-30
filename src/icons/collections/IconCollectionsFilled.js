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

const IconCollectionsFilled = ({ className = '', color = lightestCharcoal, height = 32, title, width = 32 }: Props) => (
    <AccessibleSVG
        className={`icon-collections-filled ${className}`}
        height={height}
        title={title}
        viewBox="3 3 26 26"
        width={width}
    >
        <path
            fill={color}
            fillRule="nonzero"
            d="M9.415 3H27a2 2 0 0 1 2 2v17.585a2 2 0 0 1-2 2H9.415a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM4.226 13.792c.678 0 1.227.55 1.227 1.227v9.528a2 2 0 0 0 2 2h9.528a1.226 1.226 0 0 1 0 2.453H7a4 4 0 0 1-4-4v-9.981c0-.677.55-1.227 1.226-1.227z"
        />
    </AccessibleSVG>
);

export default IconCollectionsFilled;
