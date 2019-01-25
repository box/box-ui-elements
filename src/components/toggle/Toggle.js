// @flow
import * as React from 'react';
import classNames from 'classnames';

import './Toggle.scss';

type Props = {
    className?: string,
    /** Description of the input */
    description?: React.Node,
    inputProps?: Object,
    isDisabled?: boolean,
    /** Toggle state */
    isOn?: boolean,
    /** If set to true, the toggle will be aligned to the right */
    isToggleRightAligned?: boolean,
    /** Label displayed for the input */
    label: React.Node,
    /** Name of the input */
    name?: string,
    /** change callback function called with event as the argument */
    onChange?: Function,
};

const Toggle = ({
    className = '',
    description,
    inputProps = {},
    isDisabled,
    isOn,
    isToggleRightAligned = false,
    label,
    name,
    onChange,
}: Props) => {
    const classes = classNames('toggle-container', className, {
        'is-toggle-right-aligned': isToggleRightAligned,
    });
    let toggleElements = [
        <div key="toggle-simple-switch" className="toggle-simple-switch" />,
        <div key="toggle-simple-label" className="toggle-simple-label">
            {label}
        </div>,
    ];

    if (isToggleRightAligned) {
        toggleElements = toggleElements.reverse();
    }

    return (
        <div className={classes}>
            <label className="toggle-simple">
                <input
                    checked={isOn}
                    className="toggle-simple-input"
                    disabled={isDisabled}
                    name={name}
                    onChange={onChange}
                    type="checkbox"
                    {...inputProps}
                />
                {toggleElements}
            </label>
            {description ? <div className="toggle-simple-description">{description}</div> : null}
        </div>
    );
};

export default Toggle;
