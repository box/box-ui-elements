/**
 * @flow
 * @file avatar component
 * @author Box
 */
import * as React from 'react';
import AvatarComponent from 'box-react-ui/lib/components/avatar';
import type { User } from '../../../flowTypes';

type Props = {
    user: User,
    getAvatarUrl: (string) => Promise<?string>
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

    componentWillReceiveProps(nextProps: Props) {
        if (this.props.user !== nextProps.user) {
            // if the user object changes, clear out the state and get the new avatar url
            this.setState({
                avatarUrl: null
            });
            this.getAvatarUrl();
        }
    }

    getAvatarUrl() {
        const { user, getAvatarUrl }: Props = this.props;

        getAvatarUrl(user.id).then(this.getAvatarUrlHandler);
    }

    componentDidMount() {
        this.getAvatarUrl();
    }

    render() {
        const { user, getAvatarUrl }: Props = this.props;
        const { avatarUrl }: State = this.state;

        if (!avatarUrl) {
            return null;
        }

        const { id, name } = user;

        return <AvatarComponent id={id} name={name} avatarUrl={getAvatarUrl(id)} />;
    }
}

export default Avatar;
