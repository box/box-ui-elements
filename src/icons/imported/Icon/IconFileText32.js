// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import AccessibleSVG from '../../accessible-svg';

type SvgProps = {
    height?: number,
    title?: string | React.Element<any>,
    width?: number,
};

const IconFileText32 = (props: SvgProps) => (
    <AccessibleSVG width={32} height={32} viewBox="0 0 32 32" {...props}>
        <g fill="none" fillRule="evenodd">
            <path
                fill="#0061D5"
                fillRule="nonzero"
                d="M9 3h9.586a1 1 0 01.707.293l6.415 6.414a1 1 0 01.293.707V26A3 3 0 0123 29H9a3 3 0 01-3-3V6a3 3 0 013-3z"
            />
            <path
                fill="#FFF"
                fillOpacity={0.5}
                fillRule="nonzero"
                d="M19.286 3.286l5.01 5.009 1.412 1.412a1 1 0 01.203.293H21a2 2 0 01-2-2V3.09a1 1 0 01.286.196z"
            />
            <path
                fill="#FFF"
                d="M17.5 21c.245 0 .45.183.492.412L18 21.5c0 .276-.23.5-.5.5h-7a.505.505 0 01-.5-.5c0-.276.23-.5.5-.5h7zm4-3c.245 0 .45.183.492.412L22 18.5c0 .276-.229.5-.5.5h-11a.505.505 0 01-.5-.5c0-.276.229-.5.5-.5h11zm-1.001-3c.246 0 .45.183.493.412L21 15.5c0 .276-.23.5-.501.5H10.5a.506.506 0 01-.501-.5c0-.276.23-.5.501-.5h10z"
            />
        </g>
    </AccessibleSVG>
);

export default IconFileText32;
