// @flow
import * as React from 'react';

import Avatar from '../avatar';
import DatalistItem from '../datalist-item';

import './ContactDatalistItem.scss';

type Props = {
    getContactAvatarUrl?: (contact: { id: string, [key: string]: any }) => string | Promise<?string>,
    id?: string,
    isExternal?: boolean,
    name: ?string,
    showAvatar?: boolean,
    subtitle?: React.Node,
};

type State = {
    avatarUrl: ?string,
};

class ContactDatalistItem extends React.PureComponent<Props, State> {
    state = {
        avatarUrl: undefined,
    };

    isMounted: boolean = false;

    /**
     * Success handler for getting avatar url
     *
     * @param {string} [avatarUrl] the user avatar url
     */
    getAvatarUrlHandler = (avatarUrl: ?string) => {
        if (this.isMounted) {
            this.setState({
                avatarUrl,
            });
        }
    };

    /**
     * Gets the avatar URL for the user from the getContactAvatarUrl prop
     *
     * @return {void}
     */
    getAvatarUrl() {
        const { getContactAvatarUrl, id } = this.props;
        Promise.resolve(getContactAvatarUrl && id ? getContactAvatarUrl({ id }) : undefined)
            .then(this.getAvatarUrlHandler)
            .catch(() => {
                // noop
            });
    }

    componentDidMount() {
        this.isMounted = true;
        this.getAvatarUrl();
    }

    componentWillUnmount() {
        this.isMounted = false;
    }

    render() {
        const { getContactAvatarUrl, id, isExternal, name, showAvatar, subtitle, ...rest } = this.props;
        const { avatarUrl } = this.state;

        return (
            <DatalistItem className="contact-data-list-item" {...rest}>
                {showAvatar && (
                    <Avatar
                        className="contact-avatar"
                        id={id}
                        name={name}
                        isExternal={isExternal}
                        shouldShowExternal
                        avatarUrl={avatarUrl}
                    />
                )}
                <div className="contact-name-container">
                    <div className="contact-text contact-name">{name}</div>
                    {subtitle && <div className="contact-text contact-sub-name">{subtitle}</div>}
                </div>
            </DatalistItem>
        );
    }
}

export default ContactDatalistItem;
