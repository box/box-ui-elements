/**
 * @flow
 * @file avatar component
 * @author Box
 */
import * as React from 'react';
import AvatarComponent from 'box-react-ui/lib/components/avatar';
import type { User, BoxItem } from '../../../flowTypes';

type Props = {
    user: User,
    file: BoxItem,
    getAvatarUrl: (string, string) => Promise<?string>
};

type State = {
    avatarUrl: ?string
};

class Avatar extends React.PureComponent<Props, State> {
    state = {
        avatarUrl: null
    };

    /**
     * Success handler for getting avatar url
     *
     * @param {string} avatarUrl the user avatar url
     */
    getAvatarUrlHandler(avatarUrl: ?string) {
        this.setState({
            avatarUrl
        });
    }

    getAvatarUrl() {
        const { user, file, getAvatarUrl }: Props = this.props;
        if (typeof file === 'object' && file.id) {
            getAvatarUrl(user.id, file.id).then(this.getAvatarUrlHandler);
        }
    }

    componentDidMount() {
        this.getAvatarUrl();
    }

    render() {
        const { user }: Props = this.props;
        const { avatarUrl }: State = this.state;

        if (!avatarUrl) {
            return null;
        }

        const { id, name } = user;

        return <AvatarComponent id={id} name={name} avatarUrl={avatarUrl} />;
    }
}

export default Avatar;
