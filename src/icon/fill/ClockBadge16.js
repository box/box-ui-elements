// @flow
/* eslint-disable react/jsx-sort-props */
import * as React from 'react';
import * as vars from '../../styles/variables';
import AccessibleSVG from '../../icons/accessible-svg';
import type { Icon } from '../../icons/flowTypes';

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

const ClockBadge16 = (props: Icon) => (
    <AccessibleSVG width={16} height={16} viewBox="0 0 16 16" {...props}>
        <path
            fill={vars.bdlGray50}
            fillRule="evenodd"
            d="M8 1a7 7 0 110 14A7 7 0 018 1zm-.5 2a.5.5 0 00-.5.5v5a.5.5 0 00.5.5h3a.5.5 0 100-1H7.999L8 3.5a.5.5 0 00-.41-.492z"
        />
    </AccessibleSVG>
);

export default ClockBadge16;
