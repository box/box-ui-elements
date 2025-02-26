// @flow
import * as React from 'react';
import classnames from 'classnames';
import { Link } from '../../../../../components/link';
import type { GetProfileUrlCallback } from '../../../../common/flowTypes';
import './UserLink.scss';

type Props = {
    className?: string,
    getUserProfileUrl?: GetProfileUrlCallback,
    id: string,
    name: string,
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
        const { name, getUserProfileUrl, className, ...rest }: Props = this.props;
        const { profileUrl }: State = this.state;

        return profileUrl ? (
            <Link className={classnames('bcs-UserLink', className)} {...rest} href={profileUrl}>
                {name}
            </Link>
        ) : (
            <span {...rest}>{name}</span>
        );
    }
}

export default UserLink;
