// @flow
import * as React from 'react';
import classNames from 'classnames';

import AccessibleSVG from '../accessible-svg';
import { bdlGray80 } from '../../styles/variables';

import type { Icon } from '../flowTypes';

const IconCollectionsStar = ({ className = '', color = bdlGray80, height = 16, title, width = 16 }: Icon) => (
    <AccessibleSVG
        className={classNames('bdl-IconCollectionsStar', className)}
        height={height}
        title={title}
        viewBox="0 0 16 16"
        width={width}
    >
        <path
            className="fill-color"
            fill={color}
            fillRule="evenodd"
            d="M13.888 1C14.502 1 15 1.498 15 2.112v9.776c0 .614-.498 1.112-1.112 1.112H4.112A1.112 1.112 0 0 1 3 11.888V2.112C3 1.498 3.498 1 4.112 1h9.776zM14 2H4v10h10V2zM7.555 9.955c-.281.153-.604-.105-.549-.44l.273-1.653L6.121 6.69c-.234-.237-.11-.66.208-.708l1.613-.244.718-1.513a.37.37 0 0 1 .68 0l.719 1.513 1.612.244c.317.048.442.471.208.708l-1.158 1.173.273 1.653c.055.335-.268.594-.549.44L9 9.165l-1.445.79zM1.5 7c.25 0 .5.135.5.5v5.103C2 13.504 2.5 14 3.397 14H8.5c.358.01.5.25.5.5s-.142.49-.5.5H3.154A2.154 2.154 0 0 1 1 12.847V7.5c0-.364.25-.5.5-.5z"
        />
    </AccessibleSVG>
);

export default IconCollectionsStar;
