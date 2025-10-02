import * as React from 'react';
export declare const basic: () => React.JSX.Element;
export declare const basicWithKeyboardInput: () => React.JSX.Element;
export declare const withDescription: () => React.JSX.Element;
export declare const manuallyEditable: () => React.JSX.Element;
export declare const manuallyEditableAndAccessible: () => React.JSX.Element;
export declare const withLimitedDateRange: () => React.JSX.Element;
export declare const alwaysVisibleWithCustomInputField: () => React.JSX.Element;
export declare const disabledWithErrorMessage: () => React.JSX.Element;
export declare const customErrorTooltipPosition: () => React.JSX.Element;
export declare const withRange: () => React.JSX.Element;
export declare const withRangeAndKeyboardInput: () => React.JSX.Element;
declare const _default: {
    title: string;
    component: React.FC<import("react-intl").WithIntlProps<import("./DatePicker").DatePickerProps>> & {
        WrappedComponent: React.ComponentType<import("./DatePicker").DatePickerProps>;
    };
    parameters: {
        notes: string;
    };
};
export default _default;
