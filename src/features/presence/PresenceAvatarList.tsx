import * as React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';
// @ts-ignore flow import
import PresenceAvatar from './PresenceAvatar';
import PresenceAvatarTooltipContent from './PresenceAvatarTooltipContent';
import Tooltip, { TooltipPosition } from '../../components/tooltip';
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

function PresenceAvatarList(props: Props, ref: React.Ref<HTMLDivElement>): React.ReactElement | null {
    const {
        avatarAttributes,
        className,
        collaborators,
        hideAdditionalCount,
        hideTooltips,
        maxAdditionalCollaborators = 99,
        maxDisplayedAvatars = 3,
        onAvatarMouseEnter = noop,
        onAvatarMouseLeave = noop,
        ...rest
    } = props;

    const [activeTooltip, setActiveTooltip] = React.useState<string | null>(null);

    const hideTooltip = (): void => {
        setActiveTooltip(null);
        if (onAvatarMouseLeave) {
            onAvatarMouseLeave();
        }
    };

    const showTooltip = (id: string): void => {
        setActiveTooltip(id);
        if (onAvatarMouseEnter) {
            onAvatarMouseEnter(id);
        }
    };

    if (!collaborators.length) {
        return null;
    }

    return (
        <div ref={ref} className={classNames('bdl-PresenceAvatarList', className)} {...rest}>
            {collaborators.slice(0, maxDisplayedAvatars).map(collaborator => {
                const { id, avatarUrl, name, isActive, interactedAt, interactionType } = collaborator;
                return (
                    <Tooltip
                        key={id}
                        isShown={!hideTooltips && activeTooltip === id}
                        position={TooltipPosition.BOTTOM_CENTER}
                        text={
                            <PresenceAvatarTooltipContent
                                name={name}
                                interactedAt={interactedAt}
                                interactionType={interactionType}
                                isActive={isActive}
                            />
                        }
                    >
                        <PresenceAvatar
                            aria-hidden="true"
                            avatarUrl={avatarUrl}
                            id={id}
                            isActive={isActive}
                            name={name}
                            onBlur={hideTooltip}
                            onFocus={() => showTooltip(id)}
                            onMouseEnter={() => showTooltip(id)}
                            onMouseLeave={hideTooltip}
                            {...avatarAttributes}
                        />
                    </Tooltip>
                );
            })}

            {!hideAdditionalCount && collaborators.length > maxDisplayedAvatars && (
                <div
                    className={classNames('bdl-PresenceAvatarList-count', 'avatar')}
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                    tabIndex={0}
                    {...avatarAttributes}
                >
                    {collaborators.length - maxDisplayedAvatars > maxAdditionalCollaborators
                        ? `${maxAdditionalCollaborators}+`
                        : `+${collaborators.length - maxDisplayedAvatars}`}
                </div>
            )}
        </div>
    );
}

export { PresenceAvatarList as PresenceAvatarListComponent };

export default React.forwardRef(PresenceAvatarList);
