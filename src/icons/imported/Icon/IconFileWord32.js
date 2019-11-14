// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import AccessibleSVG from '../../accessible-svg';

type SvgProps = {
    height?: number,
    title?: string | React.Element<any>,
    width?: number,
};

const IconFileWord32 = (props: SvgProps) => (
    <AccessibleSVG width={32} height={32} viewBox="0 0 32 32" {...props}>
        <g fill="none">
            <path
                fill="#2B579A"
                d="M9 3h9.586a1 1 0 01.707.293l6.415 6.414a1 1 0 01.293.707V26A3 3 0 0123 29H9a3 3 0 01-3-3V6a3 3 0 013-3z"
            />
            <path
                fill="#FFF"
                fillOpacity={0.5}
                d="M19.286 3.286l5.01 5.009 1.412 1.412a1 1 0 01.203.293H21a2 2 0 01-2-2V3.09a1 1 0 01.286.196z"
            />
            <path
                fill="#FFF"
                d="M17.5 12v.75h3.75a.75.75 0 01.743.648L22 13.5v9a.75.75 0 01-.648.743l-.102.007H17.5V24L10 22.687v-9.375L17.5 12zm3.75 1.5H17.5V15h2.25v.75H17.5v.75h2.25v.75H17.5V18h2.25v.75H17.5v.75h2.25v.75H17.5v2.25h3.75v-9zM16 15.75l-.818.053-.472 2.947v.015l-.653-2.888-.75.053-.555 2.775v.008l-.555-2.716-.697.046.75 4.012.75.053.533-2.678v-.008l.54 2.76.99.068.937-4.5z"
            />
        </g>
    </AccessibleSVG>
);

export default IconFileWord32;
