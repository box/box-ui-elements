import * as React from 'react';
export declare const regular: () => React.JSX.Element;
export declare const withoutAnimation: () => React.JSX.Element;
export declare const circle: () => React.JSX.Element;
export declare const rectangle: () => React.JSX.Element;
export declare const pill: () => React.JSX.Element;
export declare const complicatedLayout: () => React.JSX.Element;
declare const _default: {
    title: string;
    component: ({ isAnimated, className, height, width, borderRadius, style, ...rest }: {
        borderRadius?: string | number;
        className?: string;
        height?: string | number;
        isAnimated?: boolean;
        style?: {};
        width?: string | number;
    }) => React.JSX.Element;
    parameters: {
        notes: string;
    };
};
export default _default;
