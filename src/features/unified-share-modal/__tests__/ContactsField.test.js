import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { emailValidator } from '../../../utils/validators';

import { ContactsFieldBase as ContactsField } from '../ContactsField';
import messages from '../messages';

describe('features/unified-share-modal/ContactsField', () => {
    const contactsFromServer = [
        {
            email: 'w@example.com',
            id: '9875',
            isExternalUser: false,
            name: 'W User',
            type: 'user',
        },
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

    const suggestions = {
        // expectedContacts[1]
        23456: {
            id: '23456',
            userScore: 0.5,
            email: 'y@example.com',
            name: 'Y User',
            type: 'user',
            isExternalUser: false,
        },
        // expectedContacts[2]
        34567: {
            id: '34567',
            userScore: 0.1,
            email: 'z@example.com',
            name: 'Z User',
            type: 'user',
            isExternalUser: true,
        },
    };

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
        test('should sort suggestions by highest score without duplication', () => {
            const wrapper = getWrapper({
                suggestedCollaborators: suggestions,
            });

            const result = wrapper.instance().addSuggestedContacts(expectedContacts);

            expect(result.map(c => c.id)).toEqual([
                expectedContacts[1].id,
                expectedContacts[2].id,
                expectedContacts[0].id,
            ]);
        });

        test('should setState with number of suggested items showing', () => {
            const wrapper = getWrapper({
                suggestedCollaborators: suggestions,
            });

            wrapper.instance().addSuggestedContacts(expectedContacts);

            expect(wrapper.state().numSuggestedShowing).toEqual(2);
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
            const addSuggestedContactsMock = jest.fn(c => c);

            wrapper.setState({ pillSelectorInputValue: 'x@' });
            wrapper.instance().addSuggestedContacts = addSuggestedContactsMock;

            wrapper.instance().filterContacts(contactsFromServer);
            expect(addSuggestedContactsMock).not.toHaveBeenCalled();

            wrapper.setProps({
                suggestedCollaborators: { 12345: { id: 12345 }, 23456: { id: 23456 } },
            });

            wrapper.instance().filterContacts(contactsFromServer);
            expect(addSuggestedContactsMock).toHaveBeenCalled();
        });

        test('Should return contacts in the correct format', () => {
            const wrapper = getWrapper({
                selectedContacts: [],
                suggestedCollaborators: suggestions,
            });

            wrapper.setState({ pillSelectorInputValue: 'user' });
            const result = wrapper.instance().filterContacts(contactsFromServer);
            expect(result).toMatchSnapshot();
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

        test('should get avatar URLs when prop is provided', async () => {
            const getContacts = jest.fn().mockReturnValue(Promise.resolve(contactsFromServer));
            const getContactAvatarUrlMock = jest.fn(contact => `/test?id=${contact.id}`);

            const wrapper = getWrapper({
                getContactAvatarUrl: getContactAvatarUrlMock,
                getContacts,
                showContactAvatars: true,
            });
            wrapper.instance().handlePillSelectorInput('w');
            await wrapper.instance().getContactsPromise('w');

            expect(wrapper.find('PillSelectorDropdown ContactDatalistItem').props().getContactAvatarUrl).toBeDefined();
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

    describe('parseItems()', () => {
        test.each`
            inputValue                                                    | expectedItems
            ${'a@example.com'}                                            | ${['a@example.com']}
            ${'Foo Bar <fbar@example.com>; Test User <test@example.com>'} | ${['fbar@example.com', 'test@example.com']}
            ${'not_an_email; Test User <test@example.com>'}               | ${['test@example.com']}
            ${'malformed,emailtest@example.com'}                          | ${[]}
            ${'123'}                                                      | ${[]}
            ${'not_an_email'}                                             | ${[]}
        `(
            'should correctly parse pill selector input "$inputValue" and return $expectedItems',
            ({ inputValue, expectedItems }) => {
                const wrapper = getWrapper({ validator: emailValidator });
                const { parseItems } = wrapper.find('PillSelectorDropdown').props();

                expect(parseItems(inputValue)).toEqual(expectedItems);
            },
        );
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
                suggestedCollaborators: { 12: { id: 12, userScore: 1 } },
            });

            wrapper.setState({ pillSelectorInputValue: 'a' });
            await wrapper.instance().getContactsPromise('a');

            expect(wrapper.find('PillSelectorDropdown').props()).toBeDefined();
        });

        test('should render divider at the correct index when there are suggested collabs', async () => {
            const wrapper = getWrapper({
                getContacts,
                suggestedCollaborators: { 12: { id: 12, userScore: 1 } },
            });

            wrapper.setState({ pillSelectorInputValue: 'a' });
            await wrapper.instance().getContactsPromise('a');

            expect(wrapper.find('PillSelectorDropdown').props().dividerIndex).toBe(1);
        });

        test('should pass tooltipWrapperClassName to PillSelectorDropdown when provided', () => {
            const tooltipWrapperClassName = 'bdl-UnifiedShareModal-tooltipWrapper';
            const wrapper = getWrapper({ tooltipWrapperClassName });

            expect(wrapper.find('PillSelectorDropdown').prop('tooltipWrapperClassName')).toBe(tooltipWrapperClassName);
        });
    });
});
