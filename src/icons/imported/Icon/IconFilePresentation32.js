// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import AccessibleSVG from '../../accessible-svg';

type SvgProps = {
    height?: number,
    title?: string | React.Element<any>,
    width?: number,
};

const IconFilePresentation32 = (props: SvgProps) => (
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
                d="M15.643 20.354a.5.5 0 00.707 0l5.003-5a.5.5 0 10-.706-.708l-4.65 4.647-1.647-1.647a.5.5 0 00-.707 0L9.646 21.65a.5.5 0 10.708.707l3.643-3.649 1.646 1.647z"
            />
        </g>
    </AccessibleSVG>
);

export default IconFilePresentation32;
