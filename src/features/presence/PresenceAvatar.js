import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Avatar from '../../components/avatar';

const PresenceAvatar = ({
    avatarUrl,
    id,
    isActive,
    name,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    isDropDownAvatar,
    ...rest
}) => (
    <div
        className={classnames('presence-avatar', {
            'presence-avatar-notehead': !isDropDownAvatar,
            'presence-avatar-dropdown': isDropDownAvatar,
            'is-active': isActive,
        })}
        onBlur={onBlur}
        onFocus={onFocus}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={!isDropDownAvatar ? '0' : ''}
        {...rest}
    >
        <Avatar avatarUrl={avatarUrl} className={!isDropDownAvatar ? 'presence-notehead' : ''} id={id} name={name} />
    </div>
);

PresenceAvatar.propTypes = {
    avatarUrl: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isActive: PropTypes.bool,
    name: PropTypes.string.isRequired,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    isDropDownAvatar: PropTypes.bool,
};

PresenceAvatar.defaultProps = {
    isActive: false,
};

export default PresenceAvatar;
