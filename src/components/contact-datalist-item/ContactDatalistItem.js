// @flow
import * as React from 'react';

import DatalistItem from '../datalist-item';

import './ContactDatalistItem.scss';

type Props = {
    name: React.Node,
    subtitle?: React.Node,
};

const ContactDatalistItem = ({ name, subtitle, ...rest }: Props) => (
    <DatalistItem {...rest}>
        <div className="contact-text contact-name">{name}</div>
        {subtitle && <div className="contact-text contact-sub-name">{subtitle}</div>}
    </DatalistItem>
);

export default ContactDatalistItem;
