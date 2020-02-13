// @flow
import * as React from 'react';

import Avatar from '../avatar';
import DatalistItem from '../datalist-item';

import './ContactDatalistItem.scss';

type Props = {
    avatarUrl?: string | null,
    id?: string | number | null,
    name: ?string,
    showAvatar?: boolean,
    subtitle?: React.Node,
};

const ContactDatalistItem = ({ avatarUrl, id, name, showAvatar, subtitle, ...rest }: Props) => (
    <DatalistItem className="contact-data-list-item" {...rest}>
        {showAvatar && <Avatar className="contact-avatar" avatarUrl={avatarUrl} id={id} name={name} />}
        <div className="contact-name-container">
            <div className="contact-text contact-name">{name}</div>
            {subtitle && <div className="contact-text contact-sub-name">{subtitle}</div>}
        </div>
    </DatalistItem>
);

export default ContactDatalistItem;
