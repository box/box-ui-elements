import * as React from 'react';

import ContactDatalistItem from './ContactDatalistItem';

export const Example = () => (
    <ContactDatalistItem
        getContactAvatarUrl={() => 'avatar.png'}
        id="123"
        isExternal={false}
        name="Aaron Levie"
        showAvatar
        subtitle={<span>CEO</span>}
    />
);

export default {
    title: 'Components|Dropdowns/ListItems/ContactDatalistItem',
    component: ContactDatalistItem,
    parameters: {
        notes: 'Used as a child of user/contact list components such as the PillSelectorDropdown',
    },
};
