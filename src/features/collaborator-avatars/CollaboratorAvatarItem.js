/* @flow */
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Badgeable from '../../components/badgeable/Badgeable';
import Tooltip from '../../components/tooltip/Tooltip';
import Avatar from '../../components/avatar';
import IconExpirationBadge from '../../icons/general/IconExpirationBadge';

import messages from './messages';

type Props = {
    allowBadging?: boolean,
    avatarUrl: ?string,
    expiration?: {
        executeAt: string,
    },
    hasCustomAvatar: ?boolean,
    id: number,
    isExternalCollab?: boolean,
    name: string,
};

const CollaboratorAvatarItem = (props: Props) => {
    const {
        allowBadging = false,
        expiration,
        isExternalCollab = false,
        hasCustomAvatar,
        avatarUrl,
        name,
        ...rest
    } = props;

    const avatarInstance =
        hasCustomAvatar && avatarUrl ? (
            <Avatar
                avatarUrl={avatarUrl}
                name={name}
                {...rest}
                isExternal={isExternalCollab}
                shouldShowExternal={allowBadging}
            />
        ) : (
            <Avatar name={name || '-'} {...rest} isExternal={isExternalCollab} shouldShowExternal={allowBadging} />
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

    return <Badgeable topLeft={expirationBadge}>{avatarInstance}</Badgeable>;
};

export default CollaboratorAvatarItem;
