// @flow
import React from 'react';
import classnames from 'classnames';
import { injectIntl, InjectIntlProvidedProps } from 'react-intl';

import Avatar from '../../components/avatar';
import messages from './messages';

type Props = {
    avatarUrl?: string,
    id: string | number,
    isActive?: boolean,
    isDropDownAvatar?: boolean,
    name: string,
    onBlur?: Function,
    onFocus?: Function,
    onMouseEnter?: Function,
    onMouseLeave?: Function,
} & InjectIntlProvidedProps;

const PresenceAvatar = ({
    avatarUrl,
    id,
    intl,
    isActive = false,
    name,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    isDropDownAvatar,
    ...rest
}: Props) => (
    <div
        aria-label={intl.formatMessage(messages.avatarLabel, { name })}
        className={classnames('presence-avatar', {
            'presence-avatar-notehead': !isDropDownAvatar,
            'presence-avatar-dropdown': isDropDownAvatar,
            'is-active': isActive,
        })}
        onBlur={onBlur}
        onFocus={onFocus}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        role="figure"
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={!isDropDownAvatar ? '0' : ''}
        {...rest}
    >
        <Avatar avatarUrl={avatarUrl} className={!isDropDownAvatar ? 'presence-notehead' : ''} id={id} name={name} />
    </div>
);

export default injectIntl(PresenceAvatar);
