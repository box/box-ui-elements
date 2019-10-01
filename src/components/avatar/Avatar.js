// @flow
import * as React from 'react';
import classNames from 'classnames';
import AvatarImage from './AvatarImage';
import AvatarInitials from './AvatarInitials';
import UnknownUserAvatar from '../../icons/avatars/UnknownUserAvatar';

import './Avatar.scss';

const SIZES = { large: true };

type Props = {
    /**
     * Url to avatar image.  If passed in, component will render the avatar image instead of the initials
     *
     * Required if "name" is not specified.
     */
    avatarUrl?: ?string,
    /** classname to add to the container element. */
    className?: string,
    /** Users id */
    id?: ?string | number,
    /**
     * Users full name.
     *
     * Required if "avatarUrl" is not specified.
     */
    name?: ?string,
    /* avatar size (enum) */
    size?: $Keys<typeof SIZES>,
};

function Avatar({ avatarUrl, className, name, id, size = '' }: Props) {
    const [hasImageErrored, setHasImageErrored] = React.useState<boolean>(false);
    const [prevAvatarUrl, setPrevAvatarUrl] = React.useState<$PropertyType<Props, 'avatarUrl'>>(null);

    const classes = classNames(['avatar', className, { [`avatar--${size}`]: SIZES[size] }]);

    // Reset hasImageErrored state when avatarUrl changes
    if (avatarUrl !== prevAvatarUrl) {
        setHasImageErrored(false);
        setPrevAvatarUrl(avatarUrl);
    }

    let avatar;
    if (avatarUrl && !hasImageErrored) {
        avatar = (
            <AvatarImage
                onError={() => {
                    setHasImageErrored(true);
                }}
                url={avatarUrl}
            />
        );
    } else if (name) {
        avatar = <AvatarInitials id={id} name={name} />;
    } else {
        avatar = <UnknownUserAvatar className="avatar-icon" />;
    }

    return (
        <span className={classes} role="presentation">
            {avatar}
        </span>
    );
}

export default Avatar;
