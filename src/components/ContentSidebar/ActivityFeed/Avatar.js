/**
 * @flow
 * @file avatar component
 * @author Box
 */
import * as React from 'react';
import AvatarComponent from 'box-react-ui/lib/components/avatar';

type Props = {
    user: User,
    className?: string,
    getAvatarUrl?: string => Promise<?string>,
};

type State = {
    avatarUrl: ?string,
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
     * @return {Promise} a promise which resolves with the avatarUrl string
     */
    getAvatarUrl() {
        const { user, getAvatarUrl }: Props = this.props;

        if (!getAvatarUrl) {
            return Promise.resolve(user.avatar_url).then(this.getAvatarUrlHandler);
        }

        return getAvatarUrl(user.id).then(this.getAvatarUrlHandler);
    }

    componentDidMount() {
        this.getAvatarUrl();
    }

    render() {
        const { user, className, getAvatarUrl }: Props = this.props;
        const { avatarUrl }: State = this.state;

        if (getAvatarUrl && !avatarUrl) {
            return null;
        }

        const { id, name } = user;

        return <AvatarComponent className={className} id={id} name={name} avatarUrl={avatarUrl} />;
    }
}

export default Avatar;
