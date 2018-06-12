/**
 * @flow
 * @file Mention component
 */

import * as React from 'react';

type Props = {
    children?: React.Node,
    id: string,
    mentionTrigger?: any,
    getUserProfileUrl?: (string) => Promise<string>
};

type State = {
    profileUrl?: string
};

class Mention extends React.PureComponent<Props, State> {
    state = {};

    /**
     * Success handler for getting profile url
     *
     * @param {string} profileUrl the user profile url
     */
    getProfileUrlHandler = (profileUrl?: string) => {
        this.setState({
            profileUrl
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
        const { getUserProfileUrl, children, ...rest }: Props = this.props;
        const { profileUrl }: State = this.state;

        return profileUrl ? (
            <a {...rest} style={{ display: 'inline-block' }} href={profileUrl}>
                {children}
            </a>
        ) : (
            children
        );
    }
}

export default Mention;
