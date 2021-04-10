/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import * as vars from '../../styles/variables';
import AccessibleSVG, { SVGProps } from '../../components/accessible-svg/AccessibleSVG';

/**
 * This is an auto-generated component and should not be edited
 * manually in contributor pull requests.
 *
 * If you have problems with this component:
 * - https://github.com/box/box-ui-elements/issues/new?template=Bug_report.md
 *
 * If there are missing features in this component:
 * - https://github.com/box/box-ui-elements/issues/new?template=Feature_request.md
 */

const Download16 = (props: SVGProps) => (
    <AccessibleSVG width={16} height={16} viewBox="0 0 16 16" {...props}>
        <defs>
            <filter id="prefix__a">
                <feColorMatrix
                    in="SourceGraphic"
                    values="0 0 0 0 0.564706 0 0 0 0 0.564706 0 0 0 0 0.564706 0 0 0 1.000000 0"
                />
            </filter>
        </defs>
        <g fill="none" fillRule="evenodd" filter="url(#prefix__a)">
            <path
                fill={vars.bdlGray50}
                fillRule="nonzero"
                d="M14.5 15a.5.5 0 110 1h-13a.5.5 0 110-1h13zM9 1a1 1 0 011 1v.002L9.992 6 12 6a1 1 0 01.846 1.534l-.065.09-4 5a1 1 0 01-1.562 0l-4-5A1 1 0 014 6l2.004-.001.01-4.001a1 1 0 011-.998H9z"
            />
        </g>
    </AccessibleSVG>
);

export default Download16;
