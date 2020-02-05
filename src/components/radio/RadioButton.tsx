import * as React from 'react';

import './RadioButton.scss';

// @NOTE: readonly is not a valid attribute for input type radio so
// this avoids the propType error that "checked" is set without "onChange"
// eslint-disable-next-line @typescript-eslint/no-empty-function
const onChangeStub = () => {};

export interface RadioButtonProps {
    description?: React.ReactNode;
    hideLabel?: boolean;
    isDisabled?: boolean;
    isSelected?: boolean;
    label: React.ReactNode;
    name?: string;
    value: string;
}

const RadioButton = ({
    isDisabled,
    isSelected = false,
    description,
    hideLabel = false,
    label,
    name,
    value,
    ...rest
}: RadioButtonProps) => (
    <div className="radio-container">
        {/* eslint-disable-next-line jsx-a11y/label-has-for */}
        <label className="radio-label">
            <input
                checked={isSelected}
                disabled={isDisabled}
                name={name}
                onChange={onChangeStub}
                type="radio"
                value={value}
                {...rest}
            />
            <span />
            <span className={hideLabel ? 'accessibility-hidden' : ''}>{label}</span>
        </label>
        {description ? <div className="radio-description">{description}</div> : null}
    </div>
);

export default RadioButton;
