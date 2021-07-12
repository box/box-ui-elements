import React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
// @ts-ignore flow import
import messages from './messages';
// @ts-ignore flow import
import { determineInteractionMessage } from './utils/presenceUtils';

export type Props = {
    name: string;
    interactedAt: number;
    interactionType: string;
    isActive?: boolean;
} & WrappedComponentProps;

const PresenceAvatarTooltip = ({ name, interactedAt, interactionType, intl, isActive }: Props): JSX.Element => {
    const getRelativeTime = (): string => {
        if (intl.formatRelativeTime) {
            return intl.formatRelativeTime(interactedAt - Date.now());
        }
        // @ts-ignore: react-intl v2 backwards compatibility
        return intl.formatRelative(interactedAt);
    };

    const lastActionMessage = determineInteractionMessage(interactionType);
    const timeAgo = getRelativeTime();

    return (
        <div className="bdl-PresenceAvatarTooltip">
            <div>
                <span className="bdl-PresenceAvatarTooltip-name">{name}</span>
            </div>
            {lastActionMessage && (
                <div>
                    <span className="bdl-PresenceAvatarTooltip-event">
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
                </div>
            )}
        </div>
    );
};

export { PresenceAvatarTooltip as PresenceAvatarTooltipComponent };

export default injectIntl(PresenceAvatarTooltip);
