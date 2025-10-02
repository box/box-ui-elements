import * as React from 'react';
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
    isChecked?: boolean;
    /** isDisabled - whether the checkbox is disabled or not */
    isDisabled?: boolean;
    /** Label displayed for the input */
    label: React.ReactNode;
    /** Name of the input */
    name: string;
    /** onBlur - blur callback function that takes the event as the argument */
    onBlur?: ((e: React.SyntheticEvent<HTMLInputElement, Event>) => React.ReactText) | {
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
declare const Checkbox: ({ className, description, fieldLabel, hideLabel, id, inputClassName, isChecked, isDisabled, label, name, onFocus, onChange, subsection, tooltip, ...rest }: CheckboxProps) => React.JSX.Element;
export default Checkbox;
