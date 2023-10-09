import React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
// @ts-ignore flow import
import messages from './messages';
// @ts-ignore flow import
import { determineInteractionMessage, convertMillisecondsToUnitAndValue } from './utils/presenceUtils';
import './PresenceAvatarTooltipContent.scss';

export type Props = {
    name: string;
    interactedAt: number;
    interactionType: string;
    isActive?: boolean;
} & WrappedComponentProps;

function PresenceAvatarTooltipContent({ name, interactedAt, interactionType, intl, isActive }: Props): JSX.Element {
    const lastActionMessage = determineInteractionMessage(interactionType, interactedAt);
    const { unit, value } = convertMillisecondsToUnitAndValue(Math.abs(interactedAt - Date.now()));
    let timeAgo;

    if (intl.formatRelativeTime) {
        timeAgo = intl.formatRelativeTime(value, unit);
    } else {
        // @ts-ignore: react-intl v2 backwards compatibility
        timeAgo = intl.formatRelative(interactedAt);
    }

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
