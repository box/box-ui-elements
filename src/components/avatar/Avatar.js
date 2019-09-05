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

type State = {
    /** boolean to determine if image did not load correctly */
    hasImageErrored: boolean,
};

class Avatar extends React.PureComponent<Props, State> {
    state = {
        hasImageErrored: false,
    };

    UNSAFE_componentWillReceiveProps(nextProps: Props) {
        if (this.state.hasImageErrored && this.props.avatarUrl !== nextProps.avatarUrl) {
            this.setState({
                hasImageErrored: false,
            });
        }
    }

    onImageError = () => {
        this.setState({
            hasImageErrored: true,
        });
    };

    render() {
        const { avatarUrl, className, name, id, size = '' }: Props = this.props;
        const { hasImageErrored }: State = this.state;
        const classes = classNames(['avatar', className, { [`avatar--${size}`]: SIZES[size] }]);

        let avatar;
        if (avatarUrl && !hasImageErrored) {
            avatar = <AvatarImage onError={this.onImageError} url={avatarUrl} />;
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
}

export default Avatar;
