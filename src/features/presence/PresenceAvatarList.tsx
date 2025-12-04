import * as React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';
import {
    Tooltip as BPTooltip,
    TooltipProvider,
    BlueprintModernizationProvider,
    BlueprintModernizationContext,
} from '@box/blueprint-web';
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
    isPreviewModernizationEnabled?: boolean;
};

function PresenceAvatarList(props: Props, ref: React.Ref<HTMLDivElement>): JSX.Element | null {
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
        isPreviewModernizationEnabled = false,
        ...rest
    } = props;
    const blueprintContext = React.useContext(BlueprintModernizationContext);
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

    const renderAvatar = (collaborator: Collaborator) => {
        const { id, avatarUrl, name, isActive, interactedAt, interactionType } = collaborator;

        const avatarElement = (
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
        );

        const tooltipContent = (
            <PresenceAvatarTooltipContent
                name={name}
                interactedAt={interactedAt}
                interactionType={interactionType}
                isActive={isActive}
            />
        );

        if (hideTooltips) {
            return <React.Fragment key={id}>{avatarElement}</React.Fragment>;
        }

        if (isPreviewModernizationEnabled) {
            return (
                <BPTooltip key={id} content={tooltipContent} side="bottom">
                    <span>{avatarElement}</span>
                </BPTooltip>
            );
        }

        return (
            <Tooltip
                key={id}
                isShown={activeTooltip === id}
                position={TooltipPosition.BOTTOM_CENTER}
                text={tooltipContent}
            >
                {avatarElement}
            </Tooltip>
        );
    };

    const content = (
        <div ref={ref} className={classNames('bdl-PresenceAvatarList', className)} {...rest}>
            {collaborators.slice(0, maxDisplayedAvatars).map(renderAvatar)}

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

    if (isPreviewModernizationEnabled) {
        // no blueprint modernization context found from the parent component, so we need to provide our own
        if (!blueprintContext.enableModernizedComponents) {
            return (
                <BlueprintModernizationProvider enableModernizedComponents>
                    <TooltipProvider>{content}</TooltipProvider>
                </BlueprintModernizationProvider>
            );
        }
        return <TooltipProvider>{content}</TooltipProvider>;
    }
    return content;
}

export { PresenceAvatarList as PresenceAvatarListComponent };

export default React.forwardRef(PresenceAvatarList);
