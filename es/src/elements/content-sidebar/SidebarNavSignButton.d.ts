import * as React from 'react';
import { IntlShape } from 'react-intl';
import { PlainButtonProps } from '../../components/plain-button';
import './SidebarNavSignButton.scss';
export type Props = PlainButtonProps & {
    blockedReason?: string;
    intl: IntlShape;
    targetingApi?: {
        canShow: boolean;
        onClose: () => void;
        onComplete: () => void;
        onShow: () => void;
    };
};
export declare const PlaceholderTooltip: ({ children }: {
    children: React.ReactNode;
}) => React.ReactNode;
export declare function SidebarNavSignButton({ blockedReason, intl, targetingApi, ...rest }: Props): React.JSX.Element;
declare const _default: React.FC<import("react-intl").WithIntlProps<Props>> & {
    WrappedComponent: React.ComponentType<Props>;
};
export default _default;
