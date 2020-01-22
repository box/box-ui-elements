import * as React from 'react';

import CheckboxTooltip from './CheckboxTooltip';

import './Checkbox.scss';

export interface CheckboxProps {
    className?: string;
    /** Description to the checkbox */
    description?: React.ReactNode;
    /** Label for the field shown on top of the checkbox */
    fieldLabel?: React.ReactNode;
    /** Hides the checkbox label when true */
    hideLabel?: boolean;
    /** Unique `id` for the input */
    id?: string;
    /** Checkbox checked state */
    isChecked?: boolean; // @TODO: eventually call this `checked`
    /** Checkbox disabled state */
    isDisabled?: boolean; // @TODO: eventually call this `disabled`
    /** Label displayed for the input */
    label: React.ReactNode;
    /** Name of the input */
    name: string;
    /** blur callback function called with event as the argument */
    onBlur?:
        | ((e: React.SyntheticEvent<HTMLInputElement, Event>) => React.ReactText)
        | {
              (e: React.FocusEvent<Event>): void;
          };
    /** change callback function called with event as the argument */
    onChange?: (e: React.SyntheticEvent<HTMLInputElement, Event>) => string | number | boolean | void;
    /** Subsection below the checkbox */
    subsection?: React.ReactNode;
    /** Info tooltip text next to the checkbox label */
    tooltip?: string;
    /** optional value for the checkbox */
    value?: string | number | string[];
}

const Checkbox = ({
    className = '',
    description,
    fieldLabel,
    hideLabel,
    id,
    isChecked,
    isDisabled,
    label,
    name,
    onChange,
    subsection,
    tooltip,
    ...rest // @TODO: eventually remove `rest` in favor of explicit props
}: CheckboxProps) => {
    const checkboxLabel = (
        // eslint-disable-next-line jsx-a11y/label-has-for
        <label className="checkbox-label">
            <input
                checked={isChecked}
                disabled={isDisabled}
                id={id}
                name={name}
                onChange={onChange}
                type="checkbox"
                {...rest}
            />
            {/* This span is used for the before/after checkbox styles, mouse clicks will target this element */}
            <span className="checkbox-pointer-target" />
            <span className={hideLabel ? 'accessibility-hidden' : ''}>{label}</span>
        </label>
    );

    return (
        <div className={`checkbox-container ${className} ${isDisabled ? 'is-disabled' : ''}`}>
            {fieldLabel && <div className="label">{fieldLabel}</div>}
            {tooltip ? <CheckboxTooltip label={checkboxLabel} tooltip={tooltip} /> : checkboxLabel}
            {description ? <div className="checkbox-description">{description}</div> : null}
            {subsection ? <div className="checkbox-subsection">{subsection}</div> : null}
        </div>
    );
};

export default Checkbox;
