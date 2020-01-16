import * as React from 'react';
import classNames from 'classnames';
import AvatarImage from './AvatarImage';
import AvatarInitials from './AvatarInitials';
import UnknownUserAvatar from './UnknownUserAvatar';

import './Avatar.scss';

const SIZES = { large: true };

export interface AvatarProps {
    /**
     * Url to avatar image.  If passed in, component will render the avatar image instead of the initials
     *
     * Required if "name" is not specified.
     */
    avatarUrl?: string | null;
    /** classname to add to the container element. */
    className?: string;
    /** Users id */
    id?: string | number | null;
    /**
     * Users full name.
     *
     * Required if "avatarUrl" is not specified.
     */
    name?: string | null;
    /* avatar size (enum) */
    size?: keyof typeof SIZES | '';
}

function Avatar({ avatarUrl, className, name, id, size = '' }: AvatarProps) {
    const [hasImageErrored, setHasImageErrored] = React.useState<boolean>(false);
    const [prevAvatarUrl, setPrevAvatarUrl] = React.useState<AvatarProps['avatarUrl']>(null);

    const classes = classNames(['avatar', className, { [`avatar--${size}`]: size && SIZES[size] }]);

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
