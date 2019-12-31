// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import * as vars from '../../styles/variables';
import AccessibleSVG from '../../icons/accessible-svg';
import type { Icon } from '../../icons/flowTypes';

const FileVideo16 = (props: Icon) => (
    <AccessibleSVG width={16} height={16} viewBox="0 0 16 16" {...props}>
        <path
            fill={vars.bdlGray50}
            d="M9.422 1c.146 0 .286.057.389.158l3.528 3.454a.533.533 0 01.161.38v8.393c0 .892-.74 1.615-1.65 1.615h-7.7c-.911 0-1.65-.723-1.65-1.615V2.615C2.5 1.723 3.239 1 4.15 1h5.272zm-2.65 6a.271.271 0 00-.272.271v3.958a.271.271 0 00.404.236l2.957-1.978a.271.271 0 000-.474L6.904 7.035A.271.271 0 006.771 7z"
        />
    </AccessibleSVG>
);

export default FileVideo16;
