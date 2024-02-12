import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import Avatar from '../../components/avatar';
import Link from '../../components/link/LinkBase';
import messages from './messages';
import PresenceAvatar from './PresenceAvatar';
import { determineInteractionMessage } from './utils/presenceUtils';
import timeFromNow from '../../utils/relativeTime';

import './PresenceCollaborator.scss';

export const renderTimestampMessage = (interactedAt, interactionType, intl) => {
    const lastActionMessage = determineInteractionMessage(interactionType, interactedAt);
    const { value, unit } = timeFromNow(interactedAt);
    const timeAgo = intl.formatRelativeTime(value, unit);

    if (lastActionMessage) {
        return (
            <FormattedMessage
                {...lastActionMessage}
                values={{
                    timeAgo,
                }}
            />
        );
    }
    return null;
};

const PresenceCollaborator = ({ collaborator, isAnonymous = false, intl, ...props }) => {
    const { avatarUrl, id, interactedAt, interactionType, isActive, name, profileUrl } = collaborator;

    return (
        <div className="bdl-PresenceCollaborator" {...props}>
            {isAnonymous ? (
                <Avatar />
            ) : (
                <PresenceAvatar avatarUrl={avatarUrl} id={id} isActive={isActive} isDropDownAvatar name={name} />
            )}
            <div className="bdl-PresenceCollaborator-info-container">
                <div className="bdl-PresenceCollaborator-info-name" title={name}>
                    {isEmpty(profileUrl) ? (
                        <span>{name}</span>
                    ) : (
                        <Link href={profileUrl} target="_blank">
                            {name}
                        </Link>
                    )}
                </div>
                <div className="bdl-PresenceCollaborator-info-time">
                    {isActive ? (
                        <FormattedMessage {...messages.activeNowText} />
                    ) : (
                        renderTimestampMessage(interactedAt, interactionType, intl)
                    )}
                </div>
            </div>
        </div>
    );
};

PresenceCollaborator.propTypes = {
    collaborator: PropTypes.shape({
        /** Url to avatar image. If passed in, component will render the avatar image instead of the initials */
        avatarUrl: PropTypes.string,
        /** Users id */
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        isActive: PropTypes.bool,
        /** Unix timestamp of when the user last interacted with the document */
        interactedAt: PropTypes.number,
        /** The type of interaction by the user */
        interactionType: PropTypes.string,
        /** User's full name */
        name: PropTypes.string.isRequired,
        /** Custom Profile URL */
        profileUrl: PropTypes.string,
    }).isRequired,
    isAnonymous: PropTypes.bool,
    /* Intl object */
    intl: PropTypes.any,
};

export { PresenceCollaborator as PresenceCollaboratorComponent };
export default injectIntl(PresenceCollaborator);
