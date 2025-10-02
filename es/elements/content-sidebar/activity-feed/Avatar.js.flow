/**
 * @flow
 * @file avatar component
 * @author Box
 */
import * as React from 'react';
import AvatarComponent from '../../../components/avatar';
import type { GetAvatarUrlCallback } from '../../common/flowTypes';
import type { User } from '../../../common/types/core';

type Props = {
    badgeIcon?: React.Element<any>,
    className?: string,
    getAvatarUrl?: GetAvatarUrlCallback,
    user: User,
};

type State = {
    avatarUrl?: ?string,
};

class Avatar extends React.PureComponent<Props, State> {
    state = {
        avatarUrl: null,
    };

    isMounted: boolean = false;

    /**
     * Success handler for getting avatar url
     *
     * @param {string} avatarUrl the user avatar url
     */
    getAvatarUrlHandler = (avatarUrl: ?string) => {
        if (this.isMounted) {
            this.setState({
                avatarUrl,
            });
        }
    };

    /**
     * Gets the avatar URL for the user from the getAvatarUrl prop
     *
     * @return {Promise<?string>} Promise which resolve with the avatar url string
     */
    getAvatarUrl(): Promise<?string> {
        const { user = {}, getAvatarUrl }: Props = this.props;
        const { avatar_url = null, id } = user;

        const avatarPromise = id && getAvatarUrl ? getAvatarUrl(`${id}`) : Promise.resolve(avatar_url);
        return avatarPromise.then(this.getAvatarUrlHandler);
    }

    componentDidMount() {
        this.isMounted = true;
        this.getAvatarUrl();
    }

    componentWillUnmount() {
        this.isMounted = false;
    }

    render() {
        const { badgeIcon, className, user }: Props = this.props;
        const { avatarUrl }: State = this.state;
        const { id, name } = user;

        return (
            <AvatarComponent avatarUrl={avatarUrl} badgeIcon={badgeIcon} className={className} id={id} name={name} />
        );
    }
}

export default Avatar;
