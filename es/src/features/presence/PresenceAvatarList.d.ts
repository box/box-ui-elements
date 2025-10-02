import * as React from 'react';
import './PresenceAvatarList.scss';
export type Collaborator = {
    avatarUrl?: string;
    id: string;
    isActive: boolean;
    interactedAt: number;
    interactionType: string;
    name: string;
    profileUrl?: string;
};
export type Props = {
    avatarAttributes?: React.HTMLAttributes<HTMLDivElement>;
    className?: string;
    collaborators: Array<Collaborator>;
    hideAdditionalCount?: boolean;
    hideTooltips?: boolean;
    maxAdditionalCollaborators?: number;
    maxDisplayedAvatars?: number;
    onAvatarMouseEnter?: (id: string) => void;
    onAvatarMouseLeave?: () => void;
};
declare function PresenceAvatarList(props: Props, ref: React.Ref<HTMLDivElement>): JSX.Element | null;
export { PresenceAvatarList as PresenceAvatarListComponent };
declare const _default: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLDivElement>>;
export default _default;
