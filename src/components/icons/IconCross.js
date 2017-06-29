/**
 * @flow
 * @file Icon
 * @author Box
 */

import React from 'react';
import type { IconType } from '../../flowTypes';

const IconCross = ({ color = '#222', className = '', width = 14, height = 14 }: IconType) =>
    <svg width={width} height={height} viewBox='0 0 14 14' role='img' className={className}>
        <path
            fill={color}
            stroke={color}
            strokeWidth='.5'
            d='M7 6.1672l-4.995-4.995c-.2318-.2318-.6012-.2284-.8312.0016-.2232.2232-.2307.602-.0017.831L6.1673 7l-4.995 4.995c-.229.229-.2216.608.0016.8312.23.23.5994.2334.831.0017L7 7.8327l4.995 4.995c.2318.2318.6012.2284.8312-.0016.2232-.2232.2307-.602.0017-.831L7.8327 7l4.995-4.995c.229-.229.2216-.608-.0016-.8312-.23-.23-.5994-.2334-.831-.0017L7 6.1673z'
        />
    </svg>;

export default IconCross;
