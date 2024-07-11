/* @flow */
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

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
    intl: IntlShape,
    isExternalCollab?: boolean,
    name: string,
};

const CollaboratorAvatarItem = (props: Props) => {
    const {
        allowBadging = false,
        expiration,
        intl,
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

    const expirationTooltipMessage = intl.formatMessage(messages.expirationTooltipText, {
        date: expiration?.executeAt,
    });
    const expirationBadge =
        allowBadging && expiration && expiration.executeAt ? (
            <Tooltip position="middle-right" text={expirationTooltipMessage}>
                <div aria-label={expirationTooltipMessage} role="img">
                    <IconExpirationBadge className="themed" height={14} width={14} />
                </div>
            </Tooltip>
        ) : null;

    return <Badgeable topLeft={expirationBadge}>{avatarInstance}</Badgeable>;
};

export { CollaboratorAvatarItem as CollaboratorAvatarItemBase };
export default injectIntl(CollaboratorAvatarItem);
