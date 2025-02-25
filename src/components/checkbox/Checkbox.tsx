import * as React from 'react';
import uniqueId from 'lodash/uniqueId';
import classNames from 'classnames';

import CheckboxTooltip from './CheckboxTooltip';

import './Checkbox.scss';

export interface CheckboxProps {
    /** Class name for the checkbox */
    className?: string;
    /** Description for the checkbox */
    description?: React.ReactNode;
    /** fieldLabel - label for the field shown on top of the checkbox */
    fieldLabel?: React.ReactNode;
    /** hideLabel - whether the checkbox label is hidden or not */
    hideLabel?: boolean;
    /** id - Unique `id` for the input */
    id?: string;
    inputClassName?: string;
    /** isChecked - whether the checkbox is checked or not */
    isChecked?: boolean; // @TODO: eventually call this `checked`
    /** isDisabled - whether the checkbox is disabled or not */
    isDisabled?: boolean; // @TODO: eventually call this `disabled`
    /** Label displayed for the input */
    label: React.ReactNode;
    /** Name of the input */
    name: string;
    /** onBlur - blur callback function that takes the event as the argument */
    onBlur?:
        | ((e: React.SyntheticEvent<HTMLInputElement, Event>) => void)
        | {
              (e: React.FocusEvent<HTMLInputElement>): void;
          };
    /** onFocus - focus callback function that takes the event as the argument  */
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    /** onChange - change callback function that takes the event as the argument */
    onChange?: (e: React.SyntheticEvent<HTMLInputElement, Event>) => string | number | boolean | void;
    /** Subsection below the checkbox */
    subsection?: React.ReactNode;
    /** Tooltip text next to the checkbox label */
    tooltip?: string;
    /** Value for the checkbox */
    value?: string | number | string[];
}

const Checkbox = ({
    className = '',
    description,
    fieldLabel,
    hideLabel,
    id,
    inputClassName,
    isChecked,
    isDisabled,
    label,
    name,
    onFocus,
    onChange,
    subsection,
    tooltip,
    ...rest // @TODO: eventually remove `rest` in favor of explicit props
}: CheckboxProps) => {
    const generatedID = React.useRef(uniqueId('checkbox')).current;
    // use passed-in ID from props; otherwise generate one
    const inputID = id || generatedID;

    const checkboxAndLabel = (
        <span className="checkbox-label">
            <input
                aria-describedby={description ? `description_${inputID}` : ''}
                checked={isChecked}
                className={inputClassName}
                disabled={isDisabled}
                id={inputID}
                name={name}
                onFocus={onFocus}
                onChange={onChange}
                type="checkbox"
                {...rest}
            />
            {/* This span is used for the before/after custom checkbox styles, but mouse clicks will pass through this element
                    to the underlying <input> */}
            <span className="checkbox-pointer-target" />
            <span className={classNames('bdl-Checkbox-labelTooltipWrapper', { 'accessibility-hidden': hideLabel })}>
                {label && <label htmlFor={inputID}>{label}</label>}
                {tooltip && <CheckboxTooltip tooltip={tooltip} />}
            </span>
        </span>
    );

    return (
        <div className={classNames('checkbox-container', className, { 'is-disabled bdl-is-disabled': isDisabled })}>
            {fieldLabel && <div className="label">{fieldLabel}</div>}
            {checkboxAndLabel}
            {description ? (
                <div id={`description_${inputID}`} className="checkbox-description">
                    {description}
                </div>
            ) : null}
            {subsection ? <div className="checkbox-subsection">{subsection}</div> : null}
        </div>
    );
};

export default Checkbox;
