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
    const expectedJustificationReason = { displayText: 'Reason', value: '123' };

    const intl = { formatMessage: jest.fn().mockImplementation(({ id }) => id) };

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

    describe('handleRemoveRestrictedExternalContacts()', () => {
        test('should remove all contacts whose email matches a value from restrictedExternalEmails', () => {
            const onContactRemove = jest.fn();
            const updateSelectedContacts = jest.fn();
            const restrictedExternalEmails = [
                expectedContacts[0].value,
                expectedContacts[2].value,
                'not_included_in_contacts@example.com',
            ];

            const wrapper = getWrapper({
                onContactRemove,
                restrictedExternalEmails,
                selectedContacts: expectedContacts,
                updateSelectedContacts,
            });

            wrapper.instance().handleRemoveRestrictedExternalContacts();

            // The two restricted emails that match values in expectedContacts
            expect(onContactRemove).toHaveBeenCalledTimes(2);
            expect(onContactRemove).toHaveBeenCalledWith(expectedContacts[0]);
            expect(onContactRemove).toHaveBeenCalledWith(expectedContacts[2]);
            expect(updateSelectedContacts).toHaveBeenCalledTimes(1);
            expect(updateSelectedContacts).toHaveBeenCalledWith([expectedContacts[1]]);
        });

        test('should reset contact limit error when contact removal results in a contact count within the limit', () => {
            const wrapper = getWrapper({
                contactLimit: 1,
                isExpanded: true,
                onSubmit: jest.fn().mockResolvedValue({}),
                restrictedExternalEmails: [expectedContacts[2].value],
                selectedContacts: [expectedContacts[1], expectedContacts[2]],
                isRestrictionJustificationEnabled: true,
            });

            // Select justification so that no restriction-related error is triggered
            wrapper.find('ContactRestrictionNotice').simulate('selectJustificationReason', expectedJustificationReason);
            wrapper.instance().handleSubmit({ preventDefault: jest.fn() });
            expect(wrapper.state('contactsFieldError')).toBe('boxui.unifiedShare.contactsExceedLimitError');

            wrapper.instance().handleRemoveRestrictedExternalContacts();
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

    describe('handleSelectJustificationReason()', () => {
        test('should set justification reason and clear justification reason error when a value is selected', () => {
            const wrapper = getWrapper({
                isExpanded: true,
                onSubmit: jest.fn().mockResolvedValue({}),
                restrictedExternalEmails: [expectedContacts[0].value],
                selectedContacts: expectedContacts,
                isRestrictionJustificationEnabled: true,
            });

            // Trigger error by submitting without selecting a justification
            wrapper.instance().handleSubmit({ preventDefault: jest.fn() });
            expect(wrapper.find('ContactRestrictionNotice').props().error).toBe(
                'boxui.unifiedShare.justificationRequiredError',
            );

            wrapper.find('ContactRestrictionNotice').simulate('selectJustificationReason', expectedJustificationReason);
            expect(wrapper.find('ContactRestrictionNotice').props().error).toBe('');
            expect(wrapper.find('ContactRestrictionNotice').props().selectedJustificationReason).toEqual(
                expectedJustificationReason,
            );
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
                selectedJustificationReason: expectedJustificationReason,
            });

            wrapper.instance().handleClose();

            expect(wrapper.state('message')).toEqual('');
            expect(updateSelectedContacts).toHaveBeenCalledWith([]);
            expect(wrapper.state('contactsFieldError')).toEqual('');
            expect(wrapper.state('selectedJustificationReason')).toBeNull();
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
                justificationReason: null,
                message,
                restrictedExternalEmails: [],
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

        test('should include justificationReason and restrictedExternalEmails when available', () => {
            const message = 'test message';
            const event = { preventDefault: jest.fn() };
            const onSubmit = jest.fn().mockReturnValue(Promise.resolve());

            const wrapper = getWrapper({
                onSubmit,
                restrictedExternalEmails: [
                    expectedContacts[1].value,
                    expectedContacts[2].value,
                    'not_included_in_contacts@example.com',
                ],
                selectedContacts: expectedContacts,
                isRestrictionJustificationEnabled: true,
            });

            wrapper.setState({ message });
            wrapper.instance().handleSelectJustificationReason(expectedJustificationReason);
            wrapper.instance().handleSubmit(event);

            expect(onSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    justificationReason: expectedJustificationReason,
                    restrictedExternalEmails: [expectedContacts[1].value, expectedContacts[2].value],
                }),
            );
        });

        test.each`
            isRestrictionJustificationEnabled | expectedErrorId                                    | conditionDescription
            ${true}                           | ${'boxui.unifiedShare.justificationRequiredError'} | ${'justification is allowed but not selected'}
            ${false}                          | ${'boxui.unifiedShare.restrictedContactsError'}    | ${'justification is not allowed'}
        `(
            'should trigger an error and abort submit action when restricted contacts are present and $conditionDescription',
            ({ isRestrictionJustificationEnabled, expectedErrorId }) => {
                const message = 'test message';
                const event = { preventDefault: jest.fn() };
                const onSubmit = jest.fn();

                const wrapper = getWrapper({
                    onSubmit,
                    restrictedExternalEmails: [expectedContacts[1].value, expectedContacts[2].value],
                    selectedContacts: expectedContacts,
                    isRestrictionJustificationEnabled,
                });

                wrapper.setState({ message });
                wrapper.instance().handleSubmit(event);

                expect(wrapper.state('contactsRestrictionError')).toBe(expectedErrorId);
                expect(onSubmit).toHaveBeenCalledTimes(0);
            },
        );

        test('should handle errors from onSubmit prop', () => {
            const message = 'test message';
            const expectedParam = {
                emails: [],
                groupIDs: ['x@example.com'],
                justificationReason: null,
                message,
                restrictedExternalEmails: [],
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
            // manually supplemented TLD:
            {
                email: 'test@@example.cpa',
                expectedValue: true,
            },
            {
                email: 'test@@example.badTLD',
                expectedValue: true,
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

    describe('validateContactsRestrictions()', () => {
        test.each`
            isRestrictionJustificationEnabled | restrictedExternalEmails       | selectedJustificationReason    | expectedError
            ${false}                          | ${[]}                          | ${null}                        | ${''}
            ${false}                          | ${[]}                          | ${expectedJustificationReason} | ${''}
            ${true}                           | ${[expectedContacts[0].value]} | ${null}                        | ${'boxui.unifiedShare.justificationRequiredError'}
            ${true}                           | ${[expectedContacts[0].value]} | ${expectedJustificationReason} | ${''}
            ${false}                          | ${[]}                          | ${null}                        | ${''}
            ${false}                          | ${[expectedContacts[0].value]} | ${null}                        | ${'boxui.unifiedShare.restrictedContactsError'}
        `(
            'should return "$expectedError" when isRestrictionJustificationEnabled is $isRestrictionJustificationEnabled, restrictedExternalEmails is $restrictedExternalEmails and selectedJustificationReason is $selectedJustificationReason',
            ({
                isRestrictionJustificationEnabled,
                restrictedExternalEmails,
                selectedJustificationReason,
                expectedError,
            }) => {
                const wrapper = getWrapper({
                    restrictedExternalEmails,
                    selectedContacts: expectedContacts,
                    isRestrictionJustificationEnabled,
                });

                wrapper.instance().handleSelectJustificationReason(selectedJustificationReason);
                expect(wrapper.instance().validateContactsRestrictions()).toEqual(expectedError);
            },
        );
    });

    describe('isValidContactPill()', () => {
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
            test('should properly validate pill text input as email address', () => {
                const wrapper = getWrapper();

                const isValidContactPill = wrapper.instance().isValidContactPill(email);

                expect(isValidContactPill).toBe(expectedValue);
            });
        });

        test('should consider parsed contact pills as valid by default', () => {
            const wrapper = getWrapper();

            expectedContacts.forEach(contact => {
                const isValidContactPill = wrapper.instance().isValidContactPill(contact);

                expect(isValidContactPill).toBe(true);
            });
        });

        test.each`
            isRestrictionJustificationEnabled | selectedJustificationReason    | restrictedExternalEmails       | expectedIsValid
            ${false}                          | ${null}                        | ${[]}                          | ${true}
            ${false}                          | ${expectedJustificationReason} | ${[expectedContacts[0].value]} | ${false}
            ${false}                          | ${null}                        | ${[expectedContacts[0].value]} | ${false}
            ${true}                           | ${null}                        | ${[expectedContacts[0].value]} | ${false}
            ${true}                           | ${null}                        | ${[]}                          | ${true}
            ${true}                           | ${expectedJustificationReason} | ${[expectedContacts[0].value]} | ${true}
        `(
            'should have isValidContactPill return $expectedIsValid when isRestrictionJustificationEnabled = $isRestrictionJustificationEnabled, selectedJustificationReason = $selectedJustificationReason and restrictedExternalEmails = $restrictedExternalEmails',
            ({
                isRestrictionJustificationEnabled,
                selectedJustificationReason,
                restrictedExternalEmails,
                expectedIsValid,
            }) => {
                const wrapper = getWrapper();
                const contact = expectedContacts[0];

                wrapper.instance().handleSelectJustificationReason(selectedJustificationReason);
                wrapper.setProps({ restrictedExternalEmails, isRestrictionJustificationEnabled });

                const isValidContactPill = wrapper.instance().isValidContactPill(contact);
                expect(isValidContactPill).toBe(expectedIsValid);
            },
        );
    });

    describe('getContactPillClassName()', () => {
        test.each`
            isRestrictionJustificationEnabled | selectedJustificationReason    | restrictedExternalEmails       | expectedClassName
            ${false}                          | ${null}                        | ${[]}                          | ${''}
            ${false}                          | ${expectedJustificationReason} | ${[expectedContacts[0].value]} | ${''}
            ${false}                          | ${null}                        | ${[expectedContacts[0].value]} | ${''}
            ${true}                           | ${null}                        | ${[expectedContacts[0].value]} | ${''}
            ${true}                           | ${null}                        | ${[]}                          | ${''}
            ${true}                           | ${expectedJustificationReason} | ${[expectedContacts[0].value]} | ${'is-waived'}
        `(
            'should return "$expectedClassName" when isRestrictionJustificationEnabled = $isRestrictionJustificationEnabled, selectedJustificationReason = $selectedJustificationReason and restrictedExternalEmails = $restrictedExternalEmails',
            ({
                isRestrictionJustificationEnabled,
                selectedJustificationReason,
                restrictedExternalEmails,
                expectedClassName,
            }) => {
                const wrapper = getWrapper();
                const contact = expectedContacts[0];

                wrapper.instance().handleSelectJustificationReason(selectedJustificationReason);
                wrapper.setProps({ restrictedExternalEmails, isRestrictionJustificationEnabled });

                const contactPillClassName = wrapper.instance().getContactPillClassName(contact);
                expect(contactPillClassName).toBe(expectedClassName);
            },
        );
    });

    describe('componentDidUpdate()', () => {
        test('should clear other visible errors when a new error is set', () => {
            const wrapper = getWrapper({
                isExpanded: true,
                justificationReasons: [expectedJustificationReason],
                restrictedExternalEmails: [expectedContacts[0].value],
                selectedContacts: expectedContacts,
                isRestrictionJustificationEnabled: true,
            });

            wrapper.instance().validateContactField('invalid_email');
            expect(wrapper.find('ContactsField').props().error).toBe('boxui.validation.emailError');

            // Will fail validation since no justification reason has been selected
            wrapper.instance().validateContactsRestrictions();
            expect(wrapper.find('ContactsField').props().error).toBe('');
            expect(wrapper.find('ContactRestrictionNotice').props().error).toBe(
                'boxui.unifiedShare.justificationRequiredError',
            );

            // Triggering another contacts field error should clear justification field error
            wrapper.instance().validateContactField('invalid_email');
            expect(wrapper.find('ContactRestrictionNotice').props().error).toBe('');
            expect(wrapper.find('ContactsField').props().error).toBe('boxui.validation.emailError');
        });

        test('should clear selected justification reason when isRestrictionJustificationEnabled is set to false after being true', () => {
            const wrapper = getWrapper({
                isExpanded: true,
                justificationReasons: [expectedJustificationReason],
                restrictedExternalEmails: [expectedContacts[0].value],
                selectedContacts: expectedContacts,
                isRestrictionJustificationEnabled: true,
            });

            wrapper.instance().handleSelectJustificationReason(expectedJustificationReason);
            expect(wrapper.find('ContactRestrictionNotice').props().selectedJustificationReason).toEqual(
                expectedJustificationReason,
            );

            wrapper.setProps({ isRestrictionJustificationEnabled: false });
            expect(wrapper.find('ContactRestrictionNotice').props().selectedJustificationReason).toBeNull();
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

        test('should render ContactRestrictionNotice and correctly forward props when isExpanded is true and restrictedExternalEmails has matching values in selectedContacts', () => {
            const isFetchingJustificationReasons = true;
            const justificationReasons = [expectedJustificationReason];
            const restrictedExternalEmails = [expectedContacts[0].value];
            const selectedContacts = expectedContacts;
            const isRestrictionJustificationEnabled = true;

            const wrapper = getWrapper({
                isExpanded: true,
                isFetchingJustificationReasons,
                justificationReasons,
                restrictedExternalEmails,
                selectedContacts,
                isRestrictionJustificationEnabled,
            });

            expect(wrapper.find('ContactRestrictionNotice')).toHaveLength(1);
            expect(wrapper.find('ContactRestrictionNotice').props()).toEqual(
                expect.objectContaining({
                    isRestrictionJustificationEnabled,
                    isFetchingJustificationReasons,
                    justificationReasons,
                    restrictedExternalEmails,
                    selectedContacts,
                }),
            );
        });

        test.each`
            showInviteCollaboratorMessageSection | description
            ${true}                              | ${'show the message section when showInviteCollaboratorMessageSection is true'}
            ${false}                             | ${'hide the message section when showInviteCollaboratorMessageSection is false'}
        `('should $description', ({ showInviteCollaboratorMessageSection }) => {
            const config = {
                showInviteCollaboratorMessageSection,
            };

            const wrapper = getWrapper({ config, isExpanded: true });

            expect(wrapper.find('[data-testid="be-emailform-message"]')).toHaveLength(
                showInviteCollaboratorMessageSection ? 1 : 0,
            );
        });

        test('should show the message section when config is undefined', () => {
            const wrapper = getWrapper({ isExpanded: true });

            expect(wrapper.find('[data-testid="be-emailform-message"]')).toHaveLength(1);
        });
    });
});
