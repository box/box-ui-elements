// @flow
import * as React from 'react';
import classNames from 'classnames';

import './Toggle.scss';

type Props = {
    className?: string,
    /** Optional attribute used for targeting */
    'data-target-id'?: string,
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
    /** focus callback function called with event as the argument */
    onFocus?: (e: SyntheticInputEvent<HTMLInputElement>) => any,
    /** mouse enter callback function called with event as the argument */
    onMouseEnter?: (e: SyntheticInputEvent<HTMLDivElement>) => any,
    /** mouse leave callback function called with event as the argument */
    onMouseLeave?: (e: SyntheticInputEvent<HTMLDivElement>) => any,
    /** optional value for the toggles checkbox */
    value?: any,
};

const Toggle = React.forwardRef<Props, HTMLInputElement>(
    (
        {
            className = '',
            'data-target-id': dataTargetId,
            description,
            isDisabled,
            isOn,
            isToggleRightAligned = false,
            label,
            name,
            onBlur,
            onChange,
            onFocus,
            onMouseEnter,
            onMouseLeave,
            ...rest
        }: Props,
        ref,
    ) => {
        const classes = classNames('toggle-container', className, {
            'is-toggle-right-aligned': isToggleRightAligned,
        });

        const toggleElements = [
            <div key="toggle-simple-switch" className="toggle-simple-switch" />,
            <div key="toggle-simple-label" className="toggle-simple-label">
                {label}
            </div>,
        ];
        if (isToggleRightAligned) {
            toggleElements.reverse();
        }

        return (
            <div className={classes} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                {/* eslint-disable-next-line jsx-a11y/label-has-for */}
                <label className="toggle-simple" data-target-id={dataTargetId}>
                    <input
                        checked={isOn}
                        className="toggle-simple-input"
                        disabled={isDisabled}
                        name={name}
                        onBlur={onBlur}
                        onChange={onChange}
                        onFocus={onFocus}
                        ref={ref}
                        role="switch"
                        type="checkbox"
                        {...rest}
                    />
                    {toggleElements}
                </label>
                {description ? <div className="toggle-simple-description">{description}</div> : null}
            </div>
        );
    },
);
Toggle.displayName = 'Toggle';

export type ToggleProps = Props;
export default Toggle;
