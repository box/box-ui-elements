import React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
// @ts-ignore flow import
import messages from './messages';
import './PresenceAvatarTooltipContent.scss';
// @ts-ignore flow import
import { determineInteractionMessage } from './utils/presenceUtils';

export type Props = {
    name: string;
    interactedAt: number;
    interactionType: string;
    isActive?: boolean;
} & WrappedComponentProps;

function PresenceAvatarTooltipContent({ name, interactedAt, interactionType, intl, isActive }: Props): JSX.Element {
    const lastActionMessage = determineInteractionMessage(interactionType);
    const timeAgo = intl.formatRelativeTime(interactedAt - Date.now());

    return (
        <div className="bdl-PresenceAvatarTooltipContent">
            <span className="bdl-PresenceAvatarTooltipContent-name">{name}</span>
            {lastActionMessage && (
                <span className="bdl-PresenceAvatarTooltipContent-event">
                    {isActive ? (
                        <FormattedMessage {...messages.activeNowText} />
                    ) : (
                        <FormattedMessage
                            {...lastActionMessage}
                            values={{
                                timeAgo,
                            }}
                        />
                    )}
                </span>
            )}
        </div>
    );
}

export { PresenceAvatarTooltipContent as PresenceAvatarTooltipContentComponent };

export default injectIntl(PresenceAvatarTooltipContent);
