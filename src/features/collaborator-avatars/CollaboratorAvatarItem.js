/* @flow */
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Badgeable from '../../components/badgeable/Badgeable';
import Tooltip from '../../components/tooltip/Tooltip';
import Avatar from '../../components/avatar';
import IconGlobe from '../../icons/general/IconGlobe';
import IconExpirationBadge from '../../icons/general/IconExpirationBadge';

import messages from './messages';

type Props = {
    allowBadging?: boolean,
    avatarUrl: ?string,
    email?: string,
    expiration?: Object,
    hasCustomAvatar: ?boolean,
    id: number,
    isExternalCollab?: boolean,
    name: string,
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
                position="middle-right"
                text={<FormattedMessage {...messages.expirationTooltipText} values={{ date: expiration.executeAt }} />}
            >
                <div>
                    <IconExpirationBadge className="themed" height={14} width={14} />
                </div>
            </Tooltip>
        ) : null;

    const externalCollabBadge =
        allowBadging && email && isExternalCollab ? (
            <Tooltip
                position="middle-right"
                text={<FormattedMessage {...messages.externalCollabTooltipText} values={{ email }} />}
            >
                <div>
                    <IconGlobe className="themed" height={14} width={14} />
                </div>
            </Tooltip>
        ) : null;

    return (
        <Badgeable bottomLeft={externalCollabBadge} topLeft={expirationBadge}>
            {avatarInstance}
        </Badgeable>
    );
};

export default CollaboratorAvatarItem;
