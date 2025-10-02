import * as React from 'react';
import { WrappedComponentProps } from 'react-intl';
import './PresenceAvatarTooltipContent.scss';
export type Props = {
    name: string;
    interactedAt: number;
    interactionType: string;
    isActive?: boolean;
} & WrappedComponentProps;
declare function PresenceAvatarTooltipContent({ name, interactedAt, interactionType, intl, isActive }: Props): JSX.Element;
export { PresenceAvatarTooltipContent as PresenceAvatarTooltipContentComponent };
declare const _default: React.FC<import("react-intl").WithIntlProps<Props>> & {
    WrappedComponent: React.ComponentType<Props>;
};
export default _default;
