import * as React from 'react';
import './AdvancedContentInsightsToggle.scss';
interface Props {
    hasDescription?: boolean;
    hasTooltip?: boolean;
    isChecked?: boolean;
    isDisabled: boolean;
    onChange?: (isEnabled: boolean) => void;
}
declare const AdvancedContentInsightsToggle: ({ hasDescription, hasTooltip, isChecked, isDisabled, onChange, }: Props) => React.JSX.Element;
export default AdvancedContentInsightsToggle;
