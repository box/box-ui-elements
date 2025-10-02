import * as React from 'react';
export declare const withText: () => React.JSX.Element;
export declare const withIcon: () => React.JSX.Element;
export declare const withBoth: () => React.JSX.Element;
export declare const severalComponents: () => React.JSX.Element;
declare const _default: {
    title: string;
    subcomponents: {
        'LabelPill.Pill': React.ForwardRefExoticComponent<import("./LabelPill").LabelPillProps & React.RefAttributes<HTMLSpanElement>>;
        'LabelPill.Text': ({ children, className, ...rest }: import("./LabelPillText").LabelPillTextProps) => React.JSX.Element;
        'LabePill.Icon': ({ Component, className, ...rest }: import("./LabelPillIcon").LabelPillIconProps) => React.JSX.Element;
    };
    parameters: {
        notes: string;
    };
};
export default _default;
