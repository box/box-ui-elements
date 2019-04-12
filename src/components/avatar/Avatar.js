// @flow
import * as React from 'react';
import classNames from 'classnames';
import AvatarImage from './AvatarImage';
import AvatarInitials from './AvatarInitials';
import UnknownUserAvatar from '../../icons/avatars/UnknownUserAvatar';
import { getColor } from './helpers';
import { bdlNeutral04 as lightGray } from '../../styles/variables';

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
    id?: string | number,
    /** force loading state if avatarUrl is not passed
     *  (useful if avatar url is determined asynchronously to avoid flashing background color)
     */
    isPending?: boolean,
    /**
     * Users full name.
     *
     * Required if "avatarUrl" is not specified.
     */
    name?: string,
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
        const { avatarUrl, className, name, id, size = '', isPending = false }: Props = this.props;
        const { hasImageErrored }: State = this.state;
        const classes = classNames(['avatar', className, { [`avatar--${size}`]: SIZES[size] }]);

        const hasNoAvatar = !avatarUrl && !isPending;
        const loadingBackgroundColor = lightGray;
        const initialsBackgroundColor = `${getColor(id)}`;
        const backgroundColor = hasNoAvatar || hasImageErrored ? initialsBackgroundColor : loadingBackgroundColor;

        let avatar;
        if (!isPending && avatarUrl && !hasImageErrored) {
            avatar = <AvatarImage onError={this.onImageError} url={avatarUrl} />;
        } else if (!isPending && name) {
            avatar = <AvatarInitials name={name} />;
        } else if (isPending) {
            avatar = <span />;
        } else {
            avatar = <UnknownUserAvatar className="avatar-icon" />;
        }

        return (
            <span className={classes} role="presentation" style={{ backgroundColor }}>
                {avatar}
            </span>
        );
    }
}

export default Avatar;
