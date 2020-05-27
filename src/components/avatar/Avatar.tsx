import * as React from 'react';
import classNames from 'classnames';
import Badgeable from '../badgeable';
import AvatarImage from './AvatarImage';
import AvatarInitials from './AvatarInitials';
import UnknownUserAvatar from './UnknownUserAvatar';
import GlobeBadge16 from '../../icon/fill/GlobeBadge16';

import './Avatar.scss';

const SIZES = { small: true, large: true };

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
    /** Whether this avatar should be labeled as external in the current context */
    isExternal?: boolean;
    /**
     * Users full name.
     *
     * Required if "avatarUrl" is not specified.
     */
    name?: string | null;
    /** Show the external avatar marker if the avatar is marked as for an external user */
    shouldShowExternal?: boolean;
    /* avatar size (enum) */
    size?: keyof typeof SIZES | '';
}

function Avatar({ avatarUrl, className, name, id, isExternal, shouldShowExternal = false, size = '' }: AvatarProps) {
    const [hasImageErrored, setHasImageErrored] = React.useState<boolean>(false);
    const [prevAvatarUrl, setPrevAvatarUrl] = React.useState<AvatarProps['avatarUrl']>(null);

    const classes = classNames([
        'avatar',
        className,
        { [`avatar--${size}`]: size && SIZES[size], 'avatar--isExternal': shouldShowExternal && isExternal },
    ]);

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
        <Badgeable
            className={classes}
            bottomRight={
                shouldShowExternal && isExternal ? <GlobeBadge16 className="bdl-Avatar-externalBadge" /> : undefined
            }
        >
            <span role="presentation">{avatar}</span>
        </Badgeable>
    );
}

export default Avatar;
