// @flow
import * as React from 'react';
import classNames from 'classnames';

import type { Controls, ControlsFormat } from '../flowTypes';

import SecurityControlsItem from './SecurityControlsItem';
import { getShortSecurityControlsMessage, getFullSecurityControlsMessages } from './utils';
import { DEFAULT_MAX_APP_COUNT, SECURITY_CONTROLS_FORMAT } from '../constants';

import './SecurityControls.scss';

// will remove SHORT_WITH_TOOLTIP after eua release
const { FULL, SHORT, SHORT_WITH_TOOLTIP, SHORT_WITH_BTN } = SECURITY_CONTROLS_FORMAT;

type Props = {
    controls: Controls,
    controlsFormat: ControlsFormat,
    maxAppCount: number,
};

const SecurityControls = ({ controls, controlsFormat, maxAppCount }: Props) => {
    let items = [];
    let tooltipItems;

    if (controlsFormat === FULL) {
        items = getFullSecurityControlsMessages(controls, maxAppCount);
    } else {
        const shortMessage = getShortSecurityControlsMessage(controls);
        items = shortMessage ? [shortMessage] : [];

        // will remove SHORT_WITH_TOOLTIP after eua release
        if (items.length && (controlsFormat === SHORT_WITH_TOOLTIP || controlsFormat === SHORT_WITH_BTN)) {
            tooltipItems = getFullSecurityControlsMessages(controls, maxAppCount);
        }
    }

    if (!items.length) {
        return null;
    }

    const className = classNames('bdl-SecurityControls', {
        'bdl-SecurityControls--summarized': controlsFormat !== FULL,
    });

    return (
        <ul className={className}>
            {items.map((item, index) => (
                <SecurityControlsItem key={index} message={item} tooltipItems={tooltipItems} />
            ))}
        </ul>
    );
};

SecurityControls.defaultProps = {
    controls: {},
    controlsFormat: SHORT,
    maxAppCount: DEFAULT_MAX_APP_COUNT,
};

export type { Props as SecurityControlsProps };
export default SecurityControls;
