/**
 * @flow
 * @file UserLink component
 */

import * as React from 'react';

import { Link } from 'box-react-ui/lib/components/link';

type Props = {
    id: string,
    name: string,
    mentionTrigger?: any,
    getUserProfileUrl?: (string) => Promise<string>,
};

type State = {
    profileUrl?: string,
};

class UserLink extends React.PureComponent<Props, State> {
    state = {};

    /**
     * Success handler for getting profile url
     *
     * @param {string} profileUrl the user profile url
     */
    getProfileUrlHandler = (profileUrl?: string) => {
        this.setState({
            profileUrl,
        });
    };

    /**
     * Gets the profile URL for the user from the getUserProfileUrl prop
     *
     * @return {Promise} a promise which resolves with the profileUrl string
     */
    getUserProfileUrl() {
        const { id, getUserProfileUrl }: Props = this.props;
        if (!getUserProfileUrl) {
            return Promise.resolve();
        }

        return getUserProfileUrl(id).then(this.getProfileUrlHandler);
    }

    componentDidMount() {
        this.getUserProfileUrl();
    }

    render() {
        const { name, getUserProfileUrl, ...rest }: Props = this.props;
        const { profileUrl }: State = this.state;

        return profileUrl ? (
            <Link {...rest} href={profileUrl}>
                {name}
            </Link>
        ) : (
            <div {...rest}>{name}</div>
        );
    }
}

export default UserLink;
