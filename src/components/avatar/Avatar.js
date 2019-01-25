// @flow
import * as React from 'react';
import AvatarImage from './AvatarImage';
import AvatarInitials from './AvatarInitials';
import UnknownUserAvatar from '../../icons/avatars/UnknownUserAvatar';

import './Avatar.scss';

type Props = {
    /**
     * Url to avatar image.  If passed in, component will render the avatar image instead of the initials
     *
     * Required if "name" is not specified.
     */
    avatarUrl?: string,
    /** classname to add to the container element. */
    className?: string,
    /** Users id */
    id?: string | number,
    /**
     * Users full name.
     *
     * Required if "avatarUrl" is not specified.
     */
    name?: string,
};

type State = {
    /** boolean to determine if image did not load correctly */
    hasImageErrored: boolean,
};

class Avatar extends React.PureComponent<Props, State> {
    state = {
        hasImageErrored: false,
    };

    componentWillReceiveProps(nextProps: Props) {
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
        const { avatarUrl, className = '', name, id }: Props = this.props;
        const { hasImageErrored }: State = this.state;

        let avatar;
        if (avatarUrl && !hasImageErrored) {
            avatar = <AvatarImage url={avatarUrl} onError={this.onImageError} />;
        } else if (name) {
            avatar = <AvatarInitials id={id} name={name} />;
        } else {
            avatar = <UnknownUserAvatar className="avatar-icon" />;
        }

        return (
            <span className={`avatar ${className}`} role="presentation">
                {avatar}
            </span>
        );
    }
}

export default Avatar;
