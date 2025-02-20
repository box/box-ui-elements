import React, { act } from 'react';
import { mount } from 'enzyme';
import API from '../../../api';
import { GetContactsByEmailFnType } from '../types';
import useContactsByEmail from '../hooks/useContactsByEmail';
import {
    MOCK_CONTACTS_API_RESPONSE,
    MOCK_CONTACTS_BY_EMAIL_CONVERTED_RESPONSE,
    MOCK_ITEM_ID,
} from '../../../features/unified-share-modal/utils/__mocks__/USMMocks';

const handleSuccess = jest.fn();
const handleError = jest.fn();
const transformUsersSpy = jest.fn().mockReturnValue(MOCK_CONTACTS_BY_EMAIL_CONVERTED_RESPONSE);

const createAPIMock = (markerBasedUsersAPI: Record<string, unknown>): { getMarkerBasedUsersAPI: jest.Mock } => ({
    getMarkerBasedUsersAPI: jest.fn().mockReturnValue(markerBasedUsersAPI),
});

function FakeComponent({ api, transformUsers }: { api: API; transformUsers?: Function }) {
    const [getContactsByEmail, setGetContactsByEmail] = React.useState<GetContactsByEmailFnType | null>(null);

    const updatedGetContactsByEmailFn = useContactsByEmail(api, MOCK_ITEM_ID, {
        handleSuccess,
        handleError,
        transformUsers,
    });

    if (updatedGetContactsByEmailFn && !getContactsByEmail) {
        setGetContactsByEmail(() => updatedGetContactsByEmailFn);
    }

    return (
        getContactsByEmail && (
            <button onClick={getContactsByEmail} type="submit">
                &#9835; Box UI Elements &#9835;
            </button>
        )
    );
}

const MOCK_EMAIL = 'contentsharing@box.com';

describe('elements/content-sharing/hooks/useContactsByEmail', () => {
    let getUsersInEnterprise;
    let mockAPI;

    describe('with a successful API call', () => {
        beforeAll(() => {
            getUsersInEnterprise = jest.fn().mockImplementation((itemID, getUsersInEnterpriseSuccess) => {
                return getUsersInEnterpriseSuccess(MOCK_CONTACTS_API_RESPONSE);
            });
            mockAPI = createAPIMock({ getUsersInEnterprise });
        });

        test('should set the value of getContactsByEmail() and retrieve contacts on invocation', () => {
            let fakeComponent;
            act(() => {
                fakeComponent = mount(<FakeComponent api={mockAPI} transformUsers={transformUsersSpy} />);
            });
            fakeComponent.update();

            const contacts = fakeComponent.find('button').invoke('onClick')({ emails: [MOCK_EMAIL] });

            expect(getUsersInEnterprise).toHaveBeenCalledWith(MOCK_ITEM_ID, expect.anything(), expect.anything(), {
                filter_term: MOCK_EMAIL,
            });
            expect(handleSuccess).toHaveBeenCalledWith(MOCK_CONTACTS_API_RESPONSE);
            expect(transformUsersSpy).toHaveBeenCalledWith(MOCK_CONTACTS_API_RESPONSE);
            return expect(contacts).resolves.toEqual(MOCK_CONTACTS_BY_EMAIL_CONVERTED_RESPONSE);
        });

        test('should return the entries from the API data if transformUsers() is not provided', () => {
            let fakeComponent;
            act(() => {
                fakeComponent = mount(<FakeComponent api={mockAPI} />);
            });
            fakeComponent.update();

            const contacts = fakeComponent.find('button').invoke('onClick')({ emails: [MOCK_EMAIL] });

            expect(getUsersInEnterprise).toHaveBeenCalledWith(MOCK_ITEM_ID, expect.anything(), expect.anything(), {
                filter_term: MOCK_EMAIL,
            });
            expect(handleSuccess).toHaveBeenCalledWith(MOCK_CONTACTS_API_RESPONSE);
            expect(transformUsersSpy).not.toHaveBeenCalled();
            expect(contacts).resolves.toEqual(MOCK_CONTACTS_API_RESPONSE.entries);
        });

        test('should set the value of getContactsByEmail() to an empty object when no results are found', () => {
            const EMPTY_USERS = { entries: [] };
            getUsersInEnterprise = jest.fn().mockImplementation((itemID, getUsersInEnterpriseSuccess) => {
                return getUsersInEnterpriseSuccess(EMPTY_USERS);
            });
            mockAPI = createAPIMock({ getUsersInEnterprise });

            let fakeComponent;
            act(() => {
                fakeComponent = mount(<FakeComponent api={mockAPI} transformUsers={transformUsersSpy} />);
            });
            fakeComponent.update();

            const contacts = fakeComponent.find('button').invoke('onClick')({ emails: [MOCK_EMAIL] });

            expect(handleSuccess).toHaveBeenCalledWith(EMPTY_USERS);
            expect(transformUsersSpy).not.toHaveBeenCalled();
            return expect(contacts).resolves.toEqual({});
        });

        test.each`
            filterTerm                      | description
            ${'contentsharing'}             | ${'not an object'}
            ${{ content: 'sharing' }}       | ${'an object, but does not have an emails key'}
            ${{ emails: 'contentsharing' }} | ${'an object with the emails key, but filterTerm.emails is not an array'}
            ${{ emails: [] }}               | ${'an object with the emails key, but filterTerm.emails is an empty array'}
        `('should return an empty object when filterTerm is $description', ({ filterTerm }) => {
            let fakeComponent;
            act(() => {
                fakeComponent = mount(<FakeComponent api={mockAPI} />);
            });
            fakeComponent.update();

            const contacts = fakeComponent.find('button').invoke('onClick')(filterTerm);

            expect(getUsersInEnterprise).not.toHaveBeenCalled();
            expect(handleError).not.toHaveBeenCalled();
            return expect(contacts).resolves.toEqual({});
        });
    });

    describe('with a failed API call', () => {
        beforeAll(() => {
            getUsersInEnterprise = jest
                .fn()
                .mockImplementation((itemID, getUsersInEnterpriseSuccess, getUsersInEnterpriseError) => {
                    return getUsersInEnterpriseError();
                });
            mockAPI = createAPIMock({ getUsersInEnterprise });
        });

        test('should set the value of getContactsByEmail() and call handleError() when invoked', () => {
            let fakeComponent;
            act(() => {
                fakeComponent = mount(<FakeComponent api={mockAPI} transformUsers={transformUsersSpy} />);
            });
            fakeComponent.update();

            const contacts = fakeComponent.find('button').invoke('onClick')({ emails: [MOCK_EMAIL] });

            expect(getUsersInEnterprise).toHaveBeenCalledWith(MOCK_ITEM_ID, expect.anything(), expect.anything(), {
                filter_term: MOCK_EMAIL,
            });
            expect(handleError).toHaveBeenCalled();
            expect(contacts).resolves.toBeFalsy();
        });
    });
});
