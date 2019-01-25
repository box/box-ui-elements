/* @flow */
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Badgeable from 'components/badgeable/Badgeable';
import Tooltip from 'components/tooltip/Tooltip';
import Avatar from 'components/avatar';
import IconGlobe from '../../../icons/general/IconGlobe';
import IconExpirationBadge from '../../../icons/general/IconExpirationBadge';

import messages from '../messages';

type Props = {
    allowBadging?: boolean,
    avatarUrl: ?string,
    email?: string,
    expiration?: Object,
    isExternalCollab?: boolean,
    name: string,
    hasCustomAvatar: ?boolean,
    id: number,
};

const CollaboratorAvatarItem = (props: Props) => {
    const {
        allowBadging = false,
        email = '',
        expiration,
        isExternalCollab = false,
        hasCustomAvatar,
        avatarUrl,
        name,
        ...rest
    } = props;

    const avatarInstance =
        hasCustomAvatar && avatarUrl ? (
            <Avatar avatarUrl={avatarUrl} name={name} {...rest} />
        ) : (
            <Avatar name={name || '-'} {...rest} />
        );

    const expirationBadge =
        allowBadging && expiration && expiration.executeAt ? (
            <Tooltip
                text={<FormattedMessage {...messages.expirationTooltipText} values={{ date: expiration.executeAt }} />}
                position="middle-right"
            >
                <div>
                    <IconExpirationBadge className="themed" height={14} width={14} />
                </div>
            </Tooltip>
        ) : null;

    const externalCollabBadge =
        allowBadging && email && isExternalCollab ? (
            <Tooltip
                text={<FormattedMessage {...messages.externalCollabTooltipText} values={{ email }} />}
                position="middle-right"
            >
                <div>
                    <IconGlobe className="themed" height={14} width={14} />
                </div>
            </Tooltip>
        ) : null;

    return (
        <Badgeable topLeft={expirationBadge} bottomLeft={externalCollabBadge}>
            {avatarInstance}
        </Badgeable>
    );
};

export default CollaboratorAvatarItem;
