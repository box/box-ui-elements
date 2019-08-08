import * as React from 'react';

import CollaboratorAvatars from '../../collaborator-avatars/CollaboratorAvatars';
import commonMessages from '../../../common/messages';

import { EmailFormBase as EmailForm } from '../EmailForm';

describe('features/unified-share-modal/EmailForm', () => {
    const expectedContacts = [
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

    const intl = { formatMessage: jest.fn() };

    const getWrapper = (props = {}) =>
        shallow(
            <EmailForm
                contactsFieldDisabledTooltip="You do not have permission to invite collaborators."
                intl={intl}
                isContactsFieldEnabled
                getContacts={jest.fn()}
                onRequestClose={jest.fn()}
                onSubmit={jest.fn()}
                openInviteSection={jest.fn()}
                selectedContacts={[]}
                showEnterEmailsCallout
                inlineNotice={{}}
                submitting={false}
                updateSelectedContacts={jest.fn()}
                {...props}
            />,
        );

    describe('handleContactAdd()', () => {
        test('should set the selected options in the state', () => {
            const onContactAdd = jest.fn();
            const updateSelectedContacts = jest.fn();
            const wrapper = getWrapper({
                onContactAdd,
                updateSelectedContacts,
            });
            const contactsToAdd = [expectedContacts[1], expectedContacts[2]];
            wrapper.instance().handleContactAdd(contactsToAdd);

            expect(updateSelectedContacts).toHaveBeenCalledWith(contactsToAdd);
            expect(onContactAdd).toBeCalled();
        });

        test('should set error when contact limit reached', () => {
            const wrapper = getWrapper({
                contactLimit: 1,
                intl: {
                    formatMessage: jest.fn().mockReturnValue('contact limit reached'),
                },
            });

            const contactsToAdd = [expectedContacts[1], expectedContacts[2]];
            wrapper.instance().handleContactAdd(contactsToAdd);
            expect(wrapper.state('contactsFieldError')).toBe('contact limit reached');
        });
    });

    describe('handleContactRemove()', () => {
        test('should set the selected options in the state', () => {
            const onContactRemove = jest.fn();
            const updateSelectedContacts = jest.fn();
            const wrapper = getWrapper({
                onContactRemove,
                selectedContacts: [expectedContacts[0]],
                updateSelectedContacts,
            });

            // we ignore the first parameter from the pillSelector here
            wrapper.instance().handleContactRemove({}, 0);

            expect(onContactRemove).toBeCalled();
            expect(updateSelectedContacts).toHaveBeenCalledWith([]);
        });

        test('should set error when contact limit reached', () => {
            const wrapper = getWrapper({
                contactLimit: 1,
                contactsFieldError: 'contact limit reached',
                selectedContacts: [expectedContacts[1], expectedContacts[2]],
            });

            wrapper.instance().handleContactRemove(expectedContacts[1], 0);

            expect(wrapper.state('contactsFieldError')).toBe('');
        });
    });

    describe('handleMessageChange()', () => {
        test('should set the state depending on the input value', () => {
            const textarea = mount(<textarea defaultValue="test" />);

            const wrapper = getWrapper();

            wrapper.setState();

            wrapper.instance().handleMessageChange({
                target: textarea.instance(),
            });

            expect(wrapper.state('message')).toEqual('test');
        });
    });

    describe('handleClose()', () => {
        test('should reset the state', () => {
            const updateSelectedContacts = jest.fn();
            const wrapper = getWrapper({
                selectedContacts: expectedContacts,
                updateSelectedContacts,
            });

            wrapper.setState({
                message: 'test',
                contactsFieldError: 'Error',
            });

            wrapper.instance().handleClose();

            expect(wrapper.state('message')).toEqual('');
            expect(updateSelectedContacts).toHaveBeenCalledWith([]);
            expect(wrapper.state('contactsFieldError')).toEqual('');
        });
    });

    describe('handleSubmit()', () => {
        test('should not call sendInvites prop if there is a contacts field error in state', () => {
            const onSubmitSpy = jest.fn();
            const wrapper = getWrapper({
                onSubmit: onSubmitSpy,
            });
            const event = { preventDefault: jest.fn() };

            wrapper.setState({
                contactsFieldError: 'some error',
            });

            wrapper.instance().handleSubmit(event);

            expect(onSubmitSpy).not.toHaveBeenCalled();
        });

        test('should generate an error if sendInvites is called with no selected contacts', () => {
            const onSubmitSpy = jest.fn();
            const wrapper = getWrapper({
                sendInvites: onSubmitSpy,
                intl: {
                    formatMessage: () => 'error',
                },
            });
            const event = { preventDefault: jest.fn() };

            wrapper.instance().handleSubmit(event);

            expect(wrapper.state('contactsFieldError')).toEqual('error');
            expect(onSubmitSpy).not.toHaveBeenCalled();
        });

        test('should call sendInvites prop with the correct params', () => {
            const message = 'test message';
            const expectedParam = {
                emails: ['y@example.com'],
                groupIDs: ['x@example.com'],
                message,
            };
            const onSubmit = jest.fn().mockReturnValue(Promise.resolve());
            const wrapper = getWrapper({
                onSubmit,
                selectedContacts: [expectedContacts[0], expectedContacts[1]],
            });
            const event = { preventDefault: jest.fn() };

            wrapper.setState({
                message,
            });
            wrapper.instance().handleSubmit(event);

            expect(onSubmit).toHaveBeenCalledWith(expectedParam);
        });

        test('should handle errors from onSubmit prop', () => {
            const message = 'test message';
            const expectedParam = {
                emails: [],
                groupIDs: ['x@example.com'],
                message,
            };
            const onSubmit = jest.fn().mockReturnValue(
                // eslint-disable-next-line prefer-promise-reject-errors
                Promise.reject({
                    invitedEmails: ['x@example.com'],
                }),
            );
            const wrapper = getWrapper({
                onSubmit,
                selectedContacts: [expectedContacts[0]],
            });
            const event = { preventDefault: jest.fn() };

            wrapper.setState({
                message,
            });
            wrapper.instance().handleSubmit(event);

            expect(onSubmit).toHaveBeenCalledWith(expectedParam);
        });
    });

    describe('filterSentEmails()', () => {
        test('should filter out the user if that user is already selected', () => {
            const updateSelectedContacts = jest.fn();
            const wrapper = getWrapper({
                selectedContacts: [expectedContacts[0]],
                updateSelectedContacts,
            });

            const sentEmails = ['x@example.com'];

            wrapper.instance().filterSentEmails(sentEmails);
            expect(updateSelectedContacts).toHaveBeenCalledWith([]);
        });

        test('should keep the user if that user is not selected', () => {
            const updateSelectedContacts = jest.fn();
            const wrapper = getWrapper({
                selectedContacts: [expectedContacts[0]],
                updateSelectedContacts,
            });
            const sentEmails = ['y@example.com'];

            wrapper.instance().filterSentEmails(sentEmails);
            expect(updateSelectedContacts).toHaveBeenCalledWith([expectedContacts[0]]);
        });
    });

    describe('validateContactField()', () => {
        [
            {
                email: 'x@example.com',
                expectedValue: true,
            },
            {
                email: 'test.box.com',
                expectedValue: false,
            },
            {
                email: 'test@@example.com',
                expectedValue: false,
            },
        ].forEach(({ email, expectedValue }) => {
            test('should show an error if it detects an invalid email address', () => {
                const wrapper = getWrapper();

                wrapper.instance().validateContactField(email);

                if (!expectedValue) {
                    expect(intl.formatMessage).toHaveBeenCalledWith(commonMessages.invalidEmailError);
                }
            });
        });
    });

    describe('isValidEmail()', () => {
        [
            {
                email: 'x@example.com',
                expectedValue: true,
            },
            {
                email: 'test.box.com',
                expectedValue: false,
            },
            {
                email: 'foo@bar.dog',
                expectedValue: true,
            },
            {
                email: 'foo@bar.design',
                expectedValue: true,
            },
            {
                email: 'foo@bar.dev',
                expectedValue: true,
            },
            {
                email: 'test@@example.com',
                expectedValue: false,
            },
        ].forEach(({ email, expectedValue }) => {
            test('should validate email addresses properly', () => {
                const wrapper = getWrapper();

                const isValidEmail = wrapper.instance().isValidEmail(email);

                expect(isValidEmail).toBe(expectedValue);
            });
        });
    });

    describe('render()', () => {
        test('should render default component when expanded', () => {
            const wrapper = getWrapper({ isExpanded: true });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render default component with secruity indicator notes when expanded and has external users selected', () => {
            const wrapper = getWrapper({ isExpanded: true, isExternalUserSelected: true });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render default component when not expanded', () => {
            const wrapper = getWrapper({ isExpanded: false });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render default component when there is an error', () => {
            const wrapper = getWrapper({
                isExpanded: true,
                inlineNotice: {
                    type: 'error',
                    content: 'Error submitting form',
                },
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render default component when contacts field is disabled', () => {
            const wrapper = getWrapper({
                isExpanded: true,
                isContactsFieldEnabled: false,
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render default component when avatars are passed in', () => {
            const avatars = <CollaboratorAvatars />;
            const wrapper = getWrapper({
                contactsFieldAvatars: avatars,
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render default component with inline notice', () => {
            const wrapper = getWrapper({
                isExpanded: true,
                inlineNotice: {
                    type: 'error',
                    content: 'Oops, there was an error.',
                },
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should not show inline notice when form is not expanded', () => {
            const wrapper = getWrapper({
                isExpanded: false,
                inlineNotice: {
                    type: 'error',
                    content: 'Oops, there was an error.',
                },
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should not show inline notice when content is not passed in', () => {
            const wrapper = getWrapper({
                isExpanded: false,
                inlineNotice: {
                    type: 'error',
                    content: undefined,
                },
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render tooltip around EmailForm correctly if recommendedSharingTooltipCalloutName is a string', () => {
            const wrapper = getWrapper({
                recommendedSharingTooltipCalloutName: 'Foo Bar',
            });
            expect(wrapper).toMatchSnapshot();
        });

        test.each([[null], [undefined]])(
            'should render tooltip around EmailForm correctly if recommendedSharingTooltipCalloutName is null or undefined',
            recommendedSharingTooltipCalloutName => {
                const wrapper = getWrapper({
                    recommendedSharingTooltipCalloutName,
                });
                expect(wrapper).toMatchSnapshot();
            },
        );

        test('should render tooltip around EmailForm correctly if recommendedSharingTooltipCalloutName is not passed in', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });
    });
});
