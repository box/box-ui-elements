// @flow
import * as React from 'react';
import classNames from 'classnames';

import type { Position } from '../../../components/tooltip';

import SecurityControlsItem from './SecurityControlsItem';
import { getShortSecurityControlsMessage, getFullSecurityControlsMessages } from './utils';
import { SECURITY_CONTROLS_FORMAT } from './constants';

import './SecurityControls.scss';

const { FULL, SHORT, SHORT_WITH_TOOLTIP } = SECURITY_CONTROLS_FORMAT;

type Props = {
    accessPolicy: Object,
    format: string,
    tooltipPosition?: Position,
};

const SecurityControls = ({ accessPolicy, format, tooltipPosition }: Props) => {
    let items = [];
    let tooltipItems = [];

    if (format === FULL) {
        items = getFullSecurityControlsMessages(accessPolicy);
    } else {
        const shortMessage = getShortSecurityControlsMessage(accessPolicy);

        items = shortMessage ? [shortMessage] : [];

        if (items.length && format === SHORT_WITH_TOOLTIP) {
            tooltipItems = getFullSecurityControlsMessages(accessPolicy);
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
};

export default SecurityControls;
