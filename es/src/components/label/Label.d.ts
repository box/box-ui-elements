import * as React from 'react';
import './Label.scss';
export interface LabelProps {
    /** Child for the label */
    children: React.ReactElement;
    /** Whether the text of the label should be accessibly hidden */
    hideLabel?: boolean;
    /** Optional props for the icon */
    infoIconProps?: Record<string, any>;
    /** Tooltip text for the info icon */
    infoTooltip?: React.ReactNode;
    /** Optional props for the label element */
    labelElProps?: React.ComponentPropsWithoutRef<'label'>;
    /** Whether to show the `(Optional)` text next to the label for an optional field */
    showOptionalText?: boolean;
    /** The label text */
    text: React.ReactNode;
    /** Optional tooltip text for the label */
    tooltip?: React.ReactNode;
}
declare const Label: ({ text, tooltip, labelElProps, infoTooltip, infoIconProps, showOptionalText, hideLabel, children, }: LabelProps) => React.JSX.Element;
export default Label;
