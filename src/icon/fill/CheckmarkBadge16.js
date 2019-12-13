// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import AccessibleSVG from '../../icons/accessible-svg';
import type { Icon } from '../../icons/flowTypes';

const CheckmarkBadge16 = (props: Icon) => (
    <AccessibleSVG width={16} height={16} viewBox="0 0 16 16" {...props}>
        <path
            fill="#909090"
            fillRule="evenodd"
            d="M8 1a7 7 0 110 14A7 7 0 018 1zm3.928 4.627a.528.528 0 00-.715.026L6.917 9.931 4.801 7.888l-.068-.056a.458.458 0 00-.606.084.528.528 0 00.026.715l2.406 2.323.062.051c.087.06.187.088.286.082a.52.52 0 00.397-.153l4.653-4.633.055-.068a.458.458 0 00-.084-.606z"
        />
    </AccessibleSVG>
);

export default CheckmarkBadge16;
