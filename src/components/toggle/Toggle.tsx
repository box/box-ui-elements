import * as React from 'react';
import classNames from 'classnames';

import './Toggle.scss';

export interface ToggleProps
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        'checked' | 'disabled' | 'onMouseEnter' | 'onMouseLeave'
    > {
    /** CSS class for the toggle container */
    className?: string;
    /** Optional attribute used for targeting */
    'data-target-id'?: string;
    /** Description of the input */
    description?: React.ReactNode;
    /** Whether the toggle is disabled. @TODO: eventually call this `disabled` */
    isDisabled?: boolean;
    /** Toggle state. @TODO: eventually call this `checked` */
    isOn?: boolean;
    /** If set to true, the toggle will be aligned to the right */
    isToggleRightAligned?: boolean;
    /** Label displayed for the input */
    label: React.ReactNode;
    /** Name of the input */
    name?: string;
    /** blur callback function called with event as the argument */
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    /** change callback function called with event as the argument */
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** focus callback function called with event as the argument */
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    /** mouse enter callback function called with event as the argument */
    onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
    /** mouse leave callback function called with event as the argument */
    onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
    /** optional value for the toggles checkbox */
    value?: React.InputHTMLAttributes<HTMLInputElement>['value'];
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
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
        },
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

export default Toggle;
