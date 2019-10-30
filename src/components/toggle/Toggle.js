// @flow
import * as React from 'react';
import classNames from 'classnames';

import './Toggle.scss';

type Props = {
    className?: string,
    /** Description of the input */
    description?: React.Node,
    isDisabled?: boolean, // @TODO: eventually call this `disabled`
    /** Toggle state */
    isOn?: boolean, // @TODO: eventually call this `checked`
    /** If set to true, the toggle will be aligned to the right */
    isToggleRightAligned?: boolean,
    /** Label displayed for the input */
    label: React.Node,
    /** Name of the input */
    name?: string,
    /** blur callback function called with event as the argument */
    onBlur?: (e: SyntheticInputEvent<HTMLInputElement>) => any,
    /** change callback function called with event as the argument */
    onChange?: (e: SyntheticInputEvent<HTMLInputElement>) => any,
    /** optional value for the toggles checkbox */
    value?: any,
};

const Toggle = ({
    className = '',
    description,
    isDisabled,
    isOn,
    isToggleRightAligned = false,
    label,
    name,
    onBlur,
    onChange,
    ...rest
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
            {/* eslint-disable-next-line jsx-a11y/label-has-for */}
            <label className="toggle-simple">
                <input
                    checked={isOn}
                    className="toggle-simple-input"
                    disabled={isDisabled}
                    name={name}
                    onBlur={onBlur}
                    onChange={onChange}
                    type="checkbox"
                    {...rest}
                />
                {toggleElements}
            </label>
            {description ? <div className="toggle-simple-description">{description}</div> : null}
        </div>
    );
};

export type ToggleProps = Props;
export default Toggle;
