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
    isPending: boolean,
};

// Note: setting a key is required, re-render with a new user is not implemented

class Avatar extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        // short-circuit promises by checking if we already have a url
        // or if we don't have a method to get one
        const avatarUrl = props.user.avatar_url || null;
        this.state = {
            avatarUrl,
            // pending state means we are using getAvatarUrl to get a url asynchronously
            isPending: !!props.getAvatarUrl && !avatarUrl,
        };
    }

    componentDidMount() {
        this.getAvatarUrl();
    }

    async getAvatarUrl() {
        const { user, getAvatarUrl } = this.props;
        const { isPending } = this.state;
        // don't fetch if url exists or no handler was passed
        if (!isPending || !getAvatarUrl) return;

        const avatarUrl = await getAvatarUrl(user.id).catch(() => null);
        this.setState({ avatarUrl, isPending: false });
    }

    render() {
        const { user, className }: Props = this.props;
        const { avatarUrl, isPending }: State = this.state;
        const { id, name } = user;

        return (
            <AvatarComponent isPending={isPending} avatarUrl={avatarUrl} className={className} id={id} name={name} />
        );
    }
}

export default Avatar;
