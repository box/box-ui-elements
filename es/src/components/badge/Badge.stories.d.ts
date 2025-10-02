import * as React from 'react';
import { BadgeType } from './types';
export declare const regular: () => React.JSX.Element;
export declare const info: () => React.JSX.Element;
export declare const warning: () => React.JSX.Element;
export declare const highlight: () => React.JSX.Element;
export declare const error: () => React.JSX.Element;
export declare const alert: () => React.JSX.Element;
export declare const success: () => React.JSX.Element;
declare const _default: {
    title: string;
    component: ({ children, className, type, ...rest }: {
        children: React.ReactNode;
        className?: string;
        type?: BadgeType;
    }) => React.JSX.Element;
    parameters: {
        notes: string;
    };
};
export default _default;
