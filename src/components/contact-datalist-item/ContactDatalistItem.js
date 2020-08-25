// @flow
import * as React from 'react';

import Avatar from '../avatar';
import DatalistItem from '../datalist-item';

import './ContactDatalistItem.scss';

type Props = {
    getContactAvatarUrl?: (contact: { id: string, [key: string]: any }) => string,
    id?: string,
    isExternal?: boolean,
    name: ?string,
    showAvatar?: boolean,
    subtitle?: React.Node,
};

const ContactDatalistItem = ({ getContactAvatarUrl, id, isExternal, name, showAvatar, subtitle, ...rest }: Props) => (
    <DatalistItem className="contact-data-list-item" {...rest}>
        {showAvatar && (
            <Avatar
                className="contact-avatar"
                id={id}
                name={name}
                isExternal={isExternal}
                shouldShowExternal
                avatarUrl={getContactAvatarUrl && id ? getContactAvatarUrl({ id }) : undefined}
            />
        )}
        <div className="contact-name-container">
            <div className="contact-text contact-name">{name}</div>
            {subtitle && <div className="contact-text contact-sub-name">{subtitle}</div>}
        </div>
    </DatalistItem>
);

export default ContactDatalistItem;
