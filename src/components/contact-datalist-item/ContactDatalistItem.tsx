import * as React from 'react';
import Avatar from '../avatar';
import DatalistItem from '../datalist-item';

import { ContactType } from '../../features/unified-share-modal/types';
import { SuggestedPillType } from '../pill-selector-dropdown/types';

import './ContactDatalistItem.scss';

export interface ContactDatalistItemProps {
    getContactAvatarUrl?: (contact: ContactType) => string | Promise<string | null | undefined>;
    getPillImageUrl?: (data: SuggestedPillType) => string | Promise<string>;
    id?: string;
    isExternal?: boolean;
    name: string | null | undefined;
    showAvatar?: boolean;
    subtitle?: React.ReactNode;
}

interface ContactDatalistItemState {
    avatarUrl: string | null | undefined;
}

class ContactDatalistItem extends React.PureComponent<ContactDatalistItemProps, ContactDatalistItemState> {
    constructor(props: ContactDatalistItemProps) {
        super(props);
        this.state = { avatarUrl: undefined };
    }

    isMounted = false;

    /**
     * Success handler for getting avatar url
     *
     * @param {string} [avatarUrl] the user avatar url
     */
    getAvatarUrlHandler = (avatarUrl: string | null | undefined) => {
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
        Promise.resolve(
            getContactAvatarUrl && id
                ? getContactAvatarUrl({
                      id,
                  })
                : undefined,
        )
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
