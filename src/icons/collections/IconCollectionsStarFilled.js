// @flow
import * as React from 'react';
import classNames from 'classnames';

import AccessibleSVG from '../accessible-svg';
import { bdlGray } from '../../styles/variables';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const IconCollectionsStarFilled = ({ className = '', color = bdlGray, height = 32, title, width = 32 }: Props) => (
    <AccessibleSVG
        className={classNames('bdl-IconCollectionsStarFilled', className)}
        height={height}
        title={title}
        viewBox="0 0 32 32"
        width={width}
    >
        <path
            className="fill-color"
            d="M7.462 0h21.642a2.462 2.462 0 0 1 2.462 2.462v21.642a2.462 2.462 0 0 1-2.462 2.462H7.462A2.462 2.462 0 0 1 5 24.104V2.462A2.462 2.462 0 0 1 7.462 0zm7.265 20.558l3.558-1.944 3.558 1.944c.691.378 1.486-.258 1.35-1.081l-.672-4.07 2.852-2.888c.575-.583.268-1.625-.513-1.743l-3.97-.6-1.769-3.724c-.349-.736-1.323-.736-1.672 0l-1.77 3.725-3.969.6c-.781.117-1.088 1.159-.513 1.742l2.852 2.888-.672 4.07c-.136.823.659 1.46 1.35 1.081zM1.51 13.283c.834 0 1.51.676 1.51 1.51V26.52A2.462 2.462 0 0 0 5.48 28.98h11.728a1.51 1.51 0 0 1 0 3.019H4.923A4.923 4.923 0 0 1 0 27.077V14.792c0-.833.676-1.509 1.51-1.509z"
            fill={color}
            fillRule="evenodd"
        />
    </AccessibleSVG>
);

export default IconCollectionsStarFilled;
