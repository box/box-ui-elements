import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import InfoIconWithTooltip from './InfoIconWithTooltip';
import StandardLabel from './StandardLabel';
import HiddenLabel from './HiddenLabel';
import commonMessages from '../../common/messages';

import './Label.scss';

const OptionalFormattedMessage = () => (
    <span className="label-optional bdl-Label-optional">
        (<FormattedMessage {...commonMessages.optional} />)
    </span>
);

export interface LabelProps {
    /** Child for the label */
    children: React.ReactElement;
    /** Whether the text of the label should be accessibly hidden */
    hideLabel?: boolean;
    /** Optional props for the icon */
    infoIconProps?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    /** Tooltip text for the info icon */
    infoTooltip?: React.ReactNode;
    /** Whether to show the `(Optional)` text next to the label for an optional field */
    showOptionalText?: boolean;
    /** The label text */
    text: React.ReactNode;
    /** Optional tooltip text for the label */
    tooltip?: React.ReactNode;
}

const Label = ({ text, tooltip, infoTooltip, infoIconProps, showOptionalText, hideLabel, children }: LabelProps) => {
    const labelContent = [
        <span key="labelText">{text}</span>,
        showOptionalText ? <OptionalFormattedMessage key="optionalMessage" /> : null,
    ];

    if (infoTooltip) {
        labelContent.push(
            <InfoIconWithTooltip
                key="infoTooltip"
                iconProps={{ className: 'tooltip-icon', ...infoIconProps }}
                tooltipText={infoTooltip}
            />,
        );
    }

    if (hideLabel) {
        return <HiddenLabel labelContent={labelContent}>{children}</HiddenLabel>;
    }

    return (
        <StandardLabel labelContent={labelContent} tooltip={tooltip}>
            {children}
        </StandardLabel>
    );
};

export default Label;
