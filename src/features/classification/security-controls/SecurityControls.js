// @flow
import * as React from 'react';

import SecurityControlsItem from './SecurityControlsItem';
import { getShortSecurityControlsMessage, getFullSecurityControlsMessages } from './utils';
import { SECURITY_CONTROLS_FORMAT } from './constants';

import './SecurityControls.scss';

const { FULL, SHORT, SHORT_WITH_TOOLTIP } = SECURITY_CONTROLS_FORMAT;

type Props = {
    accessPolicy: Object,
    format: string,
};

const SecurityControls = ({ accessPolicy, format }: Props) => {
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

    return (
        <ul className="bdl-SecurityControls">
            {items.map((item, index) => (
                <SecurityControlsItem key={index} message={item} tooltipItems={tooltipItems} />
            ))}
        </ul>
    );
};

SecurityControls.defaultProps = {
    format: SHORT,
};

export default SecurityControls;
