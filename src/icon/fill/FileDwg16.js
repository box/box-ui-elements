// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import AccessibleSVG from '../../icons/accessible-svg';
import type { Icon } from '../../icons/flowTypes';

const FileDwg16 = (props: Icon) => (
    <AccessibleSVG width={16} height={16} viewBox="0 0 16 16" {...props}>
        <path
            fill="#909090"
            d="M9.422 1c.146 0 .286.057.389.158l3.528 3.454a.533.533 0 01.161.38v8.393c0 .892-.74 1.615-1.65 1.615h-7.7c-.911 0-1.65-.723-1.65-1.615V2.615C2.5 1.723 3.239 1 4.15 1h5.272zM8.269 5.5h-.538v2.154H6.654V8.73H4.5v.538h2.154v1.077H7.73V12.5h.538v-2.154h1.077V9.27H11.5v-.538H9.346V7.654H8.27V5.5zm.539 2.692v1.616H7.192V8.192h1.616z"
        />
    </AccessibleSVG>
);

export default FileDwg16;
