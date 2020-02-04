// @flow
import * as React from 'react';

import './RadioButton.scss';

// @NOTE: readonly is not a valid attribute for input type radio so
// this avoids the propType error that "checked" is set without "onChange"
const onChangeStub = () => {};

type Props = {
    description?: React.Node,
    hideLabel?: boolean,
    isDisabled?: boolean,
    isSelected?: boolean,
    label: React.Node,
    name?: string,
    value: string,
};

const RadioButton = ({
    isDisabled,
    isSelected = false,
    description,
    hideLabel = false,
    label,
    name,
    value,
    ...rest
}: Props) => (
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

export type RadioButtonProps = Props;
export default RadioButton;
