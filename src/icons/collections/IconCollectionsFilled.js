// @flow
import * as React from 'react';
import classNames from 'classnames';

import AccessibleSVG from '../accessible-svg';
import { bdlNeutral03 } from '../../styles/variables';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconCollectionsFilled = ({ className = '', color = bdlNeutral03, height = 32, title, width = 32 }: Props) => (
    <AccessibleSVG
        className={classNames('bdl-IconCollectionsFilled', className)}
        height={height}
        title={title}
        viewBox="0 0 32 32"
        width={width}
    >
        <path
            className="fill-color"
            d="M7.896 0h21.642A2.462 2.462 0 0 1 32 2.462v21.642a2.462 2.462 0 0 1-2.462 2.462H7.896a2.462 2.462 0 0 1-2.462-2.462V2.462A2.462 2.462 0 0 1 7.896 0zM1.509 13.283c.834 0 1.51.676 1.51 1.51V26.52a2.462 2.462 0 0 0 2.461 2.46h11.728a1.51 1.51 0 0 1 0 3.019H4.923A4.923 4.923 0 0 1 0 27.077V14.792a1.51 1.51 0 0 1 1.51-1.509z"
            fill={color}
            fillRule="evenodd"
        />
    </AccessibleSVG>
);

export default IconCollectionsFilled;
