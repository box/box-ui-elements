// @flow
import * as React from 'react';

import DatalistItem from '../datalist-item';

import './ContactDatalistItem.scss';

type Props = {
    name: string | null,
    subtitle?: React.Node,
    title?: string | null,
};

const ContactDatalistItem = ({ name, subtitle, ...rest }: Props) => (
    <DatalistItem {...rest}>
        <div className="contact-text contact-name">{name}</div>
        {subtitle && <div className="contact-text contact-sub-name">{subtitle}</div>}
    </DatalistItem>
);

export default ContactDatalistItem;
