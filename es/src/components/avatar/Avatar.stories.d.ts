import * as React from 'react';
export declare const regular: () => React.JSX.Element;
export declare const small: () => React.JSX.Element;
export declare const large: () => React.JSX.Element;
export declare const withAvatarUrl: () => React.JSX.Element;
export declare const withUrlFallbackToInitials: () => React.JSX.Element;
export declare const markedAsExternal: () => React.JSX.Element;
export declare const withBadges: () => React.JSX.Element;
export declare const withMultipleAvatars: () => React.JSX.Element;
export declare const withoutNameOrInitials: () => React.JSX.Element;
declare const _default: {
    title: string;
    component: React.FC<import("react-intl").WithIntlProps<import("./Avatar").AvatarProps>> & {
        WrappedComponent: React.ComponentType<import("./Avatar").AvatarProps>;
    };
    parameters: {
        notes: string;
    };
};
export default _default;
