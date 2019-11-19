// @flow
import * as React from 'react';
import classNames from 'classnames';

import type { Position } from '../../../components/tooltip';
import type { AccessPolicyRestrictions } from './flowTypes';

import SecurityControlsItem from './SecurityControlsItem';
import { getShortSecurityControlsMessage, getFullSecurityControlsMessages } from './utils';
import { DEFAULT_MAX_APP_COUNT, SECURITY_CONTROLS_FORMAT } from './constants';

import './SecurityControls.scss';

const { FULL, SHORT, SHORT_WITH_TOOLTIP } = SECURITY_CONTROLS_FORMAT;

type Props = {
    accessPolicyRestrictions: AccessPolicyRestrictions,
    format: $Values<typeof SECURITY_CONTROLS_FORMAT>,
    maxAppCount: number,
    tooltipPosition?: Position,
};

const SecurityControls = ({ accessPolicyRestrictions, format, maxAppCount, tooltipPosition }: Props) => {
    let items = [];
    let tooltipItems;

    if (format === FULL) {
        items = getFullSecurityControlsMessages(accessPolicyRestrictions, maxAppCount);
    } else {
        const shortMessage = getShortSecurityControlsMessage(accessPolicyRestrictions);
        items = shortMessage ? [shortMessage] : [];

        if (items.length && format === SHORT_WITH_TOOLTIP) {
            tooltipItems = getFullSecurityControlsMessages(accessPolicyRestrictions, maxAppCount);
        }
    }

    if (!items.length) {
        return null;
    }

    const className = classNames('bdl-SecurityControls', {
        'bdl-SecurityControls--summarized': format !== FULL,
    });

    return (
        <ul className={className}>
            {items.map((item, index) => (
                <SecurityControlsItem
                    key={index}
                    message={item}
                    tooltipItems={tooltipItems}
                    tooltipPosition={tooltipPosition}
                />
            ))}
        </ul>
    );
};

SecurityControls.defaultProps = {
    format: SHORT,
    maxAppCount: DEFAULT_MAX_APP_COUNT,
};

export default SecurityControls;
