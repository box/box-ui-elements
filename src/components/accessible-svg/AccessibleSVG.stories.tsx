import * as React from 'react';

import * as vars from '../../styles/variables';
import AccessibleSVG, { SVGProps } from './AccessibleSVG';

export const IconExample = (props: SVGProps) => (
    <AccessibleSVG width={32} height={32} viewBox="0 0 32 32" {...props}>
        <path
            fill={vars.bdlGray50}
            d="M9 3h9.172a2 2 0 011.414.586l5.83 5.828A2 2 0 0126 10.83V26a3 3 0 01-3 3H9a3 3 0 01-3-3V6a3 3 0 013-3z"
        />
    </AccessibleSVG>
);

export default {
    title: 'Components|AccessibleSVG',
    component: AccessibleSVG,
};
