/**
 * @flow
 * @file avatar component
 * @author Box
 */
import * as React from 'react';
import AvatarComponent from '../../../components/avatar';

type Props = {
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

    /**
     * Success handler for getting avatar url
     *
     * @param {string} avatarUrl the user avatar url
     */
    getAvatarUrlHandler = (avatarUrl: ?string) => {
        this.setState({
            avatarUrl,
        });
    };

    /**
     * Gets the avatar URL for the user from the getAvatarUrl prop
     *
     * @return {Promise<?string>} Promise which resolve with the avatar url string
     */
    getAvatarUrl(): Promise<?string> {
        const { user, getAvatarUrl }: Props = this.props;

        const avatarPromise = getAvatarUrl ? getAvatarUrl(user.id) : Promise.resolve(user.avatar_url);
        return avatarPromise.then(this.getAvatarUrlHandler);
    }

    componentDidMount() {
        this.getAvatarUrl();
    }

    render() {
        const { user, className }: Props = this.props;
        const { avatarUrl }: State = this.state;
        const { id, name } = user;

        return <AvatarComponent avatarUrl={avatarUrl} className={className} id={id} name={name} />;
    }
}

export default Avatar;
