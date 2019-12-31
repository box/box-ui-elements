// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import * as vars from '../../styles/variables';
import AccessibleSVG from '../../icons/accessible-svg';
import type { Icon } from '../../icons/flowTypes';

const FileDicom16 = (props: Icon) => (
    <AccessibleSVG width={16} height={16} viewBox="0 0 16 16" {...props}>
        <path
            fill={vars.bdlGray50}
            d="M9.422 1c.146 0 .286.057.389.158l3.528 3.454a.533.533 0 01.161.38v8.393c0 .892-.74 1.615-1.65 1.615h-7.7c-.911 0-1.65-.723-1.65-1.615V2.615C2.5 1.723 3.239 1 4.15 1h5.272zm1.328 11h-3.5a.252.252 0 00-.25.25c0 .134.112.25.25.25h3.5c.135 0 .25-.112.25-.25l-.004-.044A.253.253 0 0010.75 12zm0-1.5h-5.5a.252.252 0 00-.25.25c0 .134.112.25.25.25h5.5c.135 0 .25-.112.25-.25l-.004-.044a.253.253 0 00-.246-.206zM8.5 6h-1v1.25H6.25v1H7.5V9.5h1V8.25h1.25v-1H8.5V6z"
        />
    </AccessibleSVG>
);

export default FileDicom16;
