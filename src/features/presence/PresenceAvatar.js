import * as React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Avatar from '../../components/avatar';

const PresenceAvatar = ({
    avatarUrl,
    id,
    isActive = false,
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

export default PresenceAvatar;
