import * as React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
// @ts-ignore flow import
import messages from './messages';
// @ts-ignore flow import
import { determineInteractionMessage } from './utils/presenceUtils';
import './PresenceAvatarTooltipContent.scss';
// @ts-ignore flow import
import timeFromNow from '../../utils/relativeTime';

export type Props = {
    name: string;
    interactedAt: number;
    interactionType: string;
    isActive?: boolean;
} & WrappedComponentProps;

function PresenceAvatarTooltipContent({
    name,
    interactedAt,
    interactionType,
    intl,
    isActive,
}: Props): React.ReactElement {
    const lastActionMessage = determineInteractionMessage(interactionType);
    const { value, unit } = timeFromNow(interactedAt);
    const timeAgo = intl.formatRelativeTime(value, unit as Intl.RelativeTimeFormatUnit);

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
