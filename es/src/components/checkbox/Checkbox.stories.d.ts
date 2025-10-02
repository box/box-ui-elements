import * as React from 'react';
export declare const basic: () => React.JSX.Element;
export declare const controlled: () => React.JSX.Element;
export declare const disabled: () => React.JSX.Element;
export declare const withTooltip: () => React.JSX.Element;
export declare const withSubsection: () => React.JSX.Element;
declare const _default: {
    title: string;
    component: ({ className, description, fieldLabel, hideLabel, id, inputClassName, isChecked, isDisabled, label, name, onFocus, onChange, subsection, tooltip, ...rest }: import("./Checkbox").CheckboxProps) => React.JSX.Element;
    parameters: {
        notes: string;
    };
};
export default _default;
