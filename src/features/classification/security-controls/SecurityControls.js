// @flow
import * as React from 'react';
import classNames from 'classnames';

import type { Position } from '../../../components/tooltip';
import type { Controls } from './flowTypes';

import SecurityControlsItem from './SecurityControlsItem';
import { getShortSecurityControlsMessage, getFullSecurityControlsMessages } from './utils';
import { DEFAULT_MAX_APP_COUNT, SECURITY_CONTROLS_FORMAT } from './constants';

import './SecurityControls.scss';

const { FULL, SHORT, SHORT_WITH_TOOLTIP } = SECURITY_CONTROLS_FORMAT;

type Props = {
    controls: Controls,
    format: $Values<typeof SECURITY_CONTROLS_FORMAT>,
    maxAppCount: number,
    tooltipPosition?: Position,
};

const SecurityControls = ({ controls, format, maxAppCount, tooltipPosition }: Props) => {
    let items = [];
    let tooltipItems;

    if (format === FULL) {
        items = getFullSecurityControlsMessages(controls, maxAppCount);
    } else {
        const shortMessage = getShortSecurityControlsMessage(controls);
        items = shortMessage ? [shortMessage] : [];

        if (items.length && format === SHORT_WITH_TOOLTIP) {
            tooltipItems = getFullSecurityControlsMessages(controls, maxAppCount);
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

export type { Props as SecurityControlsProps };
export default SecurityControls;
