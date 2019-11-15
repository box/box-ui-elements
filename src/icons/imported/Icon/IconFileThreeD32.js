// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import AccessibleSVG from '../../accessible-svg';
import type { Icon } from '../../flowTypes';

const IconFileThreeD32 = (props: Icon) => (
    <AccessibleSVG width={32} height={32} viewBox="0 0 32 32" {...props}>
        <g fill="none">
            <path
                fill="#F7931D"
                d="M9 3h9.586a1 1 0 01.707.293l6.415 6.414a1 1 0 01.293.707V26A3 3 0 0123 29H9a3 3 0 01-3-3V6a3 3 0 013-3z"
            />
            <path
                fill="#FFF"
                fillOpacity={0.5}
                d="M19.286 3.286l5.01 5.009 1.412 1.412a1 1 0 01.203.293H21a2 2 0 01-2-2V3.09a1 1 0 01.286.196z"
            />
            <path
                fill="#FFF"
                d="M20 14.068l-3.6-1.85c-.5-.291-1.3-.291-1.8 0l-3.6 1.85c-.6.292-1 .973-1 1.556v4.768c0 .681.4 1.265 1 1.557l3.6 1.849c.496.27 1.234.27 1.8 0l3.6-1.849c.6-.292 1-.973 1-1.557v-4.768c0-.583-.4-1.264-1-1.556zm-8.6 7.103c-.2-.098-.4-.487-.4-.681v-4.768c0-.292.2-.584.4-.681l3.6-1.85c.2-.096.6-.096.9 0l3.6 1.85c.1.061.154.134.2.194l-4.2 1.761v6.12c-.2 0-.282-.05-.4-.097l-3.7-1.848z"
            />
        </g>
    </AccessibleSVG>
);

export default IconFileThreeD32;
