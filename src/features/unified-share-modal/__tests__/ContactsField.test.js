import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { ContactsFieldBase as ContactsField } from '../ContactsField';
import messages from '../messages';

describe('features/unified-share-modal/ContactsField', () => {
    const contactsFromServer = [
        {
            email: 'x@example.com',
            id: '12345',
            isExternalUser: false,
            name: 'X User',
            type: 'group',
        },
        {
            email: 'y@example.com',
            id: '23456',
            isExternalUser: true,
            name: 'Y User',
            type: 'user',
        },
        {
            email: 'z@example.com',
            id: '34567',
            isExternalUser: false,
            name: 'Z User',
            type: 'user',
        },
    ];

    const expectedContacts = [
        {
            email: 'x@example.com',
            id: '12345',
            isExternalUser: false,
            text: 'X User',
            type: 'group',
            value: 'x@example.com',
        },
        {
            email: 'y@example.com',
            id: '23456',
            isExternalUser: true,
            text: 'Y User',
            type: 'user',
            value: 'y@example.com',
        },
        {
            email: 'z@example.com',
            id: '34567',
            isExternalUser: false,
            text: 'Z User',
            type: 'user',
            value: 'z@example.com',
        },
    ];

    const intl = { formatMessage: jest.fn() };

    const getWrapper = (props = {}) =>
        shallow(
            <ContactsField
                disabled={false}
                error=""
                fieldRef={{ current: document.createElement('input') }}
                getContacts={jest.fn()}
                intl={intl}
                label={<FormattedMessage {...messages.inviteFieldLabel} />}
                onContactAdd={jest.fn()}
                onContactRemove={jest.fn()}
                onInput={jest.fn()}
                selectedContacts={expectedContacts}
                validateForError={jest.fn()}
                validator={jest.fn()}
                {...props}
            />,
        );

    describe('addSuggestedContacts()', () => {
        const suggestions = {
            '23456': { id: '23456', userScore: 0.5 }, // expectedContacts[1]
            '34567': { id: '34567', userScore: 0.1 }, // expectedContacts[2]
        };

        test('should sort suggestions by highest score', () => {
            const wrapper = getWrapper({
                suggestedCollaborators: suggestions,
            });

            const result = wrapper.instance().addSuggestedContacts(expectedContacts);

            expect(result).toEqual([expectedContacts[1], expectedContacts[2], expectedContacts[0]]);
        });

        test('should setState with number of suggested items showing', () => {
            const wrapper = getWrapper({
                suggestedCollaborators: suggestions,
            });

            wrapper.instance().addSuggestedContacts(expectedContacts);

            expect(wrapper.state().numSuggestedShowing).toEqual(2);
        });

        test('should not add suggestions not in the contact list', () => {
            const wrapper = getWrapper({
                suggestedCollaborators: {
                    '56789': { id: '56789', userScore: 1 },
                    '67890': { id: '67890', userScore: 0.1 },
                },
            });

            const result = wrapper.instance().addSuggestedContacts(expectedContacts);
            const resultIDs = result.map(contact => contact.id);

            expect(resultIDs).not.toContain('56789');
            expect(resultIDs).not.toContain('67890');
        });
    });

    describe('filterContacts()', () => {
        test('should return an empty set when the input value is blank (default)', () => {
            const wrapper = getWrapper();

            wrapper.setState({ pillSelectorInputValue: '' });

            const options = wrapper.instance().filterContacts([]);

            expect(options.length).toEqual(0);
        });

        test('should return the user based on the input value set in state', () => {
            const wrapper = getWrapper({ selectedContacts: [] });

            wrapper.setState({ pillSelectorInputValue: 'x@' });

            const options = wrapper.instance().filterContacts(contactsFromServer);

            expect(options.length).toEqual(1);
            expect(options[0]).toEqual(expectedContacts[0]);
        });

        test('should not return the user if that user is already selected', () => {
            const wrapper = getWrapper({
                selectedContacts: [expectedContacts[0]],
            });

            wrapper.setState({
                contacts: [contactsFromServer[0]],
                pillSelectorInputValue: 'x@',
            });

            const options = wrapper.instance().filterContacts(contactsFromServer);

            expect(options.length).toEqual(0);
        });

        test('should only call addSuggestedContacts() when has suggestedCollaborators', () => {
            const wrapper = getWrapper({
                selectedContacts: [],
            });
            const addSuggestedContactsMock = jest.fn();

            wrapper.setState({ pillSelectorInputValue: 'x@' });
            wrapper.instance().addSuggestedContacts = addSuggestedContactsMock;

            wrapper.instance().filterContacts(contactsFromServer);
            expect(addSuggestedContactsMock).not.toHaveBeenCalled();

            wrapper.setProps({
                suggestedCollaborators: { '12345': { id: 12345 }, '23456': { id: 23456 } },
            });

            wrapper.instance().filterContacts(contactsFromServer);
            expect(addSuggestedContactsMock).toHaveBeenCalledWith([expectedContacts[0]]);
        });
    });

    describe('getContactsPromise()', () => {
        test('should set state with contacts', async () => {
            const getContacts = jest.fn().mockReturnValue(Promise.resolve(contactsFromServer));

            const wrapper = getWrapper({
                getContacts,
                selectedContacts: [],
            });

            wrapper.setState({ pillSelectorInputValue: 'x@' });

            await wrapper.instance().getContactsPromise('x@');
            expect(wrapper.state('contacts')).toEqual([expectedContacts[0]]);
        });

        test('should return silently if promise gets canceled', async () => {
            const error = new Error();
            error.isCanceled = true;

            const getContacts = jest.fn().mockReturnValue(Promise.reject(error));

            const wrapper = getWrapper({
                getContacts,
            });

            wrapper.setState({ contacts: expectedContacts });

            await expect(wrapper.instance().getContactsPromise('test')).resolves.toBe(undefined);

            expect(wrapper.state('contacts')).toEqual(expectedContacts);
        });

        test('should rethrow if promise is not canceled', async () => {
            const err = new Error();
            err.isCanceled = false;

            const getContacts = jest.fn().mockReturnValue(Promise.reject(err));
            const wrapper = getWrapper({
                getContacts,
            });

            await expect(wrapper.instance().getContactsPromise('test')).rejects.toThrow();
        });
    });

    describe('handlePillSelectorInput()', () => {
        test('should call getContacts() and set state', () => {
            const getContacts = jest.fn().mockReturnValue(Promise.resolve(contactsFromServer));
            const onInput = jest.fn();

            const wrapper = getWrapper({
                getContacts,
                onInput,
            });

            wrapper.instance().handlePillSelectorInput('a');

            expect(wrapper.state('pillSelectorInputValue')).toEqual('a');
            expect(onInput).toHaveBeenCalled();
        });

        test('should reset contacts if input is empty', async () => {
            const getContacts = jest.fn().mockReturnValue(Promise.resolve(contactsFromServer));
            const onInput = jest.fn();

            const wrapper = getWrapper({
                getContacts,
                onInput,
            });

            wrapper.setState({ pillSelectorInputValue: '' });

            await wrapper.instance().handlePillSelectorInput('');

            expect(wrapper.state('contacts')).toEqual([]);
            expect(onInput).toHaveBeenCalled();
        });
    });

    describe('render', () => {
        test('should render default component', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });

        const contactsFromServerLarge = [
            ...contactsFromServer,
            {
                email: 'a@example.com',
                id: '12',
                isExternalUser: true,
                name: 'a b',
                type: 'user',
            },
            {
                email: 'b@example.com',
                id: '13',
                isExternalUser: false,
                name: 'a b',
                type: 'user',
            },
            {
                email: 'c@example.com',
                id: '14',
                isExternalUser: true,
                name: 'a c',
                type: 'user',
            },
            {
                email: 'd@example.com',
                id: '14',
                isExternalUser: false,
                name: 'a d',
                type: 'user',
            },
            {
                email: 'e@example.com',
                id: '14',
                isExternalUser: true,
                name: 'a e',
                type: 'user',
            },
        ];
        const getContacts = jest.fn().mockReturnValue(Promise.resolve(contactsFromServerLarge));

        test('should have scrollable dropdown if contacts > 5', async () => {
            const wrapper = getWrapper({
                getContacts,
                selectedContacts: [],
            });

            wrapper.setState({ pillSelectorInputValue: 'a' });
            await wrapper.instance().getContactsPromise('a');
            expect(wrapper).toMatchSnapshot();
        });

        test('should pass overlayTitle when there are suggested collabs', async () => {
            const wrapper = getWrapper({
                getContacts,
                suggestedCollaborators: { '12': { id: 12, userScore: 1 } },
            });

            wrapper.setState({ pillSelectorInputValue: 'a' });
            await wrapper.instance().getContactsPromise('a');

            expect(wrapper.find('PillSelectorDropdown').props()).toBeDefined();
        });

        test('should render divider at the correct index when there are suggested collabs', async () => {
            const wrapper = getWrapper({
                getContacts,
                suggestedCollaborators: { '12': { id: 12, userScore: 1 } },
            });

            wrapper.setState({ pillSelectorInputValue: 'a' });
            await wrapper.instance().getContactsPromise('a');

            expect(wrapper.find('PillSelectorDropdown').props().dividerIndex).toBe(1);
        });
    });
});
