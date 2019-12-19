// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import AccessibleSVG from '../../icons/accessible-svg';
import type { Icon } from '../../icons/flowTypes';

const PencilBadge16 = (props: Icon) => (
    <AccessibleSVG width={16} height={16} viewBox="0 0 16 16" {...props}>
        <path
            fill="#222"
            fillRule="evenodd"
            d="M8 0c4.4 0 8 3.6 8 8s-3.6 8-8 8-8-3.6-8-8 3.6-8 8-8zm0 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm2 8l-1.5 3h3c.3 0 .5.2.5.5s-.2.5-.5.5H8L6 9s1 .4 2 .4 2-.4 2-.4zM6.5 2c.3 0 .5.2.5.5v4.7c.3.1.7.1 1 .1h.19c.266-.004.57-.02.81-.1V3.5c0-.3.2-.5.5-.5s.5.2.5.5V8s-1 .3-2 .3S6 8 6 8V2.5c0-.3.2-.5.5-.5z"
        />
    </AccessibleSVG>
);

export default PencilBadge16;
