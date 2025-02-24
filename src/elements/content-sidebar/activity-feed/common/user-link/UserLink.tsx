import * as React from 'react';
import classnames from 'classnames';
import { Link } from '../../../../../components/link';
import { GetProfileUrlCallback } from '../../../../common/flowTypes';
import './UserLink.scss';

export interface UserLinkProps {
    className?: string;
    getUserProfileUrl?: GetProfileUrlCallback;
    id: string;
    name: string;
}

interface State {
    profileUrl?: string;
}

class UserLink extends React.PureComponent<UserLinkProps, State> {
    state: State = {
        profileUrl: undefined,
    };

    getProfileUrlHandler = (profileUrl?: string) => {
        this.setState({
            profileUrl,
        });
    };

    getUserProfileUrl() {
        const { id, getUserProfileUrl } = this.props;
        if (!getUserProfileUrl) {
            return Promise.resolve();
        }

        return getUserProfileUrl(id).then(this.getProfileUrlHandler);
    }

    componentDidMount() {
        this.getUserProfileUrl();
    }

    render() {
        const { name, getUserProfileUrl, className, ...rest } = this.props; // eslint-disable-line @typescript-eslint/no-unused-vars
        const { profileUrl } = this.state;

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
