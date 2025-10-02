import * as React from 'react';
import './RadioButton.scss';
export interface RadioButtonProps {
    description?: React.ReactNode;
    hideLabel?: boolean;
    isDisabled?: boolean;
    isSelected?: boolean;
    label: React.ReactNode;
    name?: string;
    value: string;
}
declare const RadioButton: ({ isDisabled, isSelected, description, hideLabel, label, name, value, ...rest }: RadioButtonProps) => React.JSX.Element;
export default RadioButton;
