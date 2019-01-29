// @flow
import * as React from 'react';

import './RadioButton.scss';

// @NOTE: readonly is not a valid attribute for input type radio so
// this avoids the propType error that "checked" is set without "onChange"
const onChangeStub = () => {};

type Props = {
    isDisabled?: boolean,
    isSelected?: boolean,
    description?: React.Node,
    hideLabel?: boolean,
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
        <label className="radio-label">
            <input
                disabled={isDisabled}
                name={name}
                onChange={onChangeStub}
                type="radio"
                checked={isSelected}
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
