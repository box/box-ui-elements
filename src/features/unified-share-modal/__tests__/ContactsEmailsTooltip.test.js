// @flow
import React from 'react';
import { shallow } from 'enzyme';

import messages from '../messages';

import ContactsEmailsTooltip from '../ContactsEmailsTooltip';

describe('features/unified-share-modal/ContactsEmailsTooltip', () => {
    let wrapper;
    let contacts;

    const getWrapper = (props = {}, children = <span>Target</span>) => {
        return shallow(
            <ContactsEmailsTooltip contacts={contacts} maxContacts={5} {...props}>
                {children}
            </ContactsEmailsTooltip>,
        );
    };

    beforeEach(() => {
        contacts = [
            {
                email: 'x@example.com',
                id: '12345',
                text: 'X User',
                type: 'group',
                value: 'x@example.com',
            },
            {
                email: 'y@example.com',
                id: '23456',
                text: 'Y User',
                type: 'user',
                value: 'y@example.com',
            },
            {
                email: 'z@example.com',
                id: '34567',
                text: 'Z User',
                type: 'user',
                value: 'z@example.com',
            },
        ];

        wrapper = getWrapper();
    });

    test('should render default ContactsEmailsTooltip component', () => {
        expect(wrapper).toMatchSnapshot();
    });

    test('should render children wrapped by tooltip', () => {
        const MyComponent = () => <span>My Component</span>;
        wrapper = getWrapper({}, <MyComponent />);

        expect(wrapper.find('Tooltip').find(MyComponent)).toHaveLength(1);
    });

    test('should disable tooltip when there are no contacts to display', () => {
        expect(wrapper.find('Tooltip').props().isDisabled).toBe(false);
        wrapper.setProps({ contacts: [] });
        expect(wrapper.find('Tooltip').props().isDisabled).toBe(true);
    });

    test('should display comma separated emails on tooltip when contacts are less or equal than maxContacts', () => {
        const expectedTooltipText = contacts.map(({ value }) => value).join(', ');
        wrapper.setProps({ maxContacts: contacts.length + 1 });

        expect(wrapper.find('Tooltip').props().text).toBe(expectedTooltipText);
    });

    test('should display message with remaining emails count on tooltip when contacts are greater than maxContacts', () => {
        const maxContacts = contacts.length - 1;
        const contactsToDisplay = contacts.slice(0, maxContacts);
        const expectedEmails = contactsToDisplay.map(({ value }) => value).join(', ');

        wrapper.setProps({ maxContacts });
        const { text: message } = wrapper.find('Tooltip').props();

        expect(message.props.id).toBe(messages.contactEmailsTooltipText.id);
        expect(message.props.values.emails).toBe(expectedEmails);
        expect(message.props.values.remainingEmailsCount).toBe(contacts.length - maxContacts);
    });
});
