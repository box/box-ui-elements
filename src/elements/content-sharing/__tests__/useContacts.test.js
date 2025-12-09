// @flow

import React, { act } from 'react';
import { mount } from 'enzyme';
import API from '../../../api';
import useContacts from '../hooks/useContacts';
import {
    MOCK_CONTACTS_API_RESPONSE,
    MOCK_CONTACTS_CONVERTED_RESPONSE,
    MOCK_GROUP_CONTACTS_API_RESPONSE,
    MOCK_GROUP_CONTACTS_CONVERTED_RESPONSE,
    MOCK_ITEM_ID,
} from '../../../features/unified-share-modal/utils/__mocks__/USMMocks';

const handleSuccess = jest.fn();
const handleError = jest.fn();
const transformUsersSpy = jest.fn().mockReturnValue(MOCK_CONTACTS_CONVERTED_RESPONSE);
const transformGroupsSpy = jest.fn().mockReturnValue(MOCK_GROUP_CONTACTS_CONVERTED_RESPONSE);

const createAPIMock = (markerBasedGroupsAPI, markerBasedUsersAPI) => ({
    getMarkerBasedGroupsAPI: jest.fn().mockReturnValue(markerBasedGroupsAPI),
    getMarkerBasedUsersAPI: jest.fn().mockReturnValue(markerBasedUsersAPI),
});

function FakeComponent({
    api,
    transformGroups,
    transformUsers,
}: {
    api: API,
    transformGroups: Function,
    transformUsers: Function,
}) {
    const [getContacts, setGetContacts] = React.useState(null);

    const updatedGetContactsFn = useContacts(api, MOCK_ITEM_ID, {
        currentUserId: '123',
        handleSuccess,
        handleError,
        transformGroups,
        transformUsers,
    });

    if (updatedGetContactsFn && !getContacts) {
        setGetContacts(() => updatedGetContactsFn);
    }

    return (
        getContacts && (
            <button onClick={getContacts} type="submit">
                &#9835; Box UI Elements &#9835;
            </button>
        )
    );
}

const MOCK_FILTER = 'Elements';

describe('elements/content-sharing/hooks/useContacts', () => {
    let getGroupsInEnterprise;
    let getUsersInEnterprise;
    let mockAPI;

    describe('with successful API calls', () => {
        beforeAll(() => {
            getGroupsInEnterprise = jest.fn().mockImplementation((itemID, getGroupsInEnterpriseSuccess) => {
                return getGroupsInEnterpriseSuccess(MOCK_GROUP_CONTACTS_API_RESPONSE);
            });
            getUsersInEnterprise = jest.fn().mockImplementation((itemID, getUsersInEnterpriseSuccess) => {
                return getUsersInEnterpriseSuccess(MOCK_CONTACTS_API_RESPONSE);
            });
            mockAPI = createAPIMock({ getGroupsInEnterprise }, { getUsersInEnterprise });
        });

        test('should set the value of getContacts() and retrieve contacts on invocation', () => {
            let fakeComponent;

            act(() => {
                fakeComponent = mount(
                    <FakeComponent
                        api={mockAPI}
                        transformGroups={transformGroupsSpy}
                        transformUsers={transformUsersSpy}
                    />,
                );
            });
            fakeComponent.update();

            const btn = fakeComponent.find('button');
            expect(btn.prop('onClick')).toBeDefined();

            const contacts = btn.invoke('onClick')(MOCK_FILTER);

            expect(getUsersInEnterprise).toHaveBeenCalledWith(
                MOCK_ITEM_ID,
                expect.anything(Function),
                expect.anything(Function),
                { filter_term: MOCK_FILTER },
            );
            expect(getGroupsInEnterprise).toHaveBeenCalledWith(
                MOCK_ITEM_ID,
                expect.anything(Function),
                expect.anything(Function),
                { fields: 'name,permissions', filter_term: MOCK_FILTER },
            );
            expect(handleSuccess).toHaveBeenCalledWith(MOCK_CONTACTS_API_RESPONSE);
            expect(handleSuccess).toHaveBeenCalledWith(MOCK_GROUP_CONTACTS_API_RESPONSE);
            expect(transformGroupsSpy).toHaveBeenCalledWith(MOCK_GROUP_CONTACTS_API_RESPONSE);
            expect(transformUsersSpy).toHaveBeenCalledWith(MOCK_CONTACTS_API_RESPONSE);
            return expect(contacts).resolves.toEqual([
                ...MOCK_CONTACTS_CONVERTED_RESPONSE,
                ...MOCK_GROUP_CONTACTS_CONVERTED_RESPONSE,
            ]);
        });

        test('should return the entries from the API data if transformUsers() is not provided', () => {
            let fakeComponent;

            act(() => {
                fakeComponent = mount(<FakeComponent api={mockAPI} />);
            });
            fakeComponent.update();

            const btn = fakeComponent.find('button');
            expect(btn.prop('onClick')).toBeDefined();

            const contacts = btn.invoke('onClick')(MOCK_FILTER);

            expect(getUsersInEnterprise).toHaveBeenCalledWith(
                MOCK_ITEM_ID,
                expect.anything(Function),
                expect.anything(Function),
                { filter_term: MOCK_FILTER },
            );
            expect(getGroupsInEnterprise).toHaveBeenCalledWith(
                MOCK_ITEM_ID,
                expect.anything(Function),
                expect.anything(Function),
                { fields: 'name,permissions', filter_term: MOCK_FILTER },
            );
            expect(handleSuccess).toHaveBeenCalledWith(MOCK_CONTACTS_API_RESPONSE);
            expect(handleSuccess).toHaveBeenCalledWith(MOCK_GROUP_CONTACTS_API_RESPONSE);
            expect(transformGroupsSpy).not.toHaveBeenCalled();
            expect(transformUsersSpy).not.toHaveBeenCalled();
            return expect(contacts).resolves.toEqual([
                ...MOCK_CONTACTS_API_RESPONSE.entries,
                ...MOCK_GROUP_CONTACTS_API_RESPONSE.entries,
            ]);
        });

        test('should set the value of getContacts() to an empty array when no results are found', () => {
            const EMPTY_GROUPS = { entries: [] };
            const EMPTY_USERS = { entries: [] };
            getGroupsInEnterprise = jest.fn().mockImplementation((itemID, getGroupsInEnterpriseSuccess) => {
                return getGroupsInEnterpriseSuccess(EMPTY_GROUPS);
            });
            getUsersInEnterprise = jest.fn().mockImplementation((itemID, getUsersInEnterpriseSuccess) => {
                return getUsersInEnterpriseSuccess(EMPTY_USERS);
            });
            mockAPI = createAPIMock({ getGroupsInEnterprise }, { getUsersInEnterprise });
            let fakeComponent;

            act(() => {
                fakeComponent = mount(
                    <FakeComponent
                        api={mockAPI}
                        transformGroups={transformGroupsSpy}
                        transformUsers={transformUsersSpy}
                    />,
                );
            });
            fakeComponent.update();

            const btn = fakeComponent.find('button');
            expect(btn.prop('onClick')).toBeDefined();
            const contacts = btn.invoke('onClick')(MOCK_FILTER);

            expect(handleSuccess).toHaveBeenCalledWith(EMPTY_GROUPS);
            expect(handleSuccess).toHaveBeenCalledWith(EMPTY_USERS);
            expect(transformGroupsSpy).not.toHaveBeenCalled();
            expect(transformUsersSpy).not.toHaveBeenCalled();
            return expect(contacts).resolves.toEqual([]);
        });

        /**
         * A successful API call will always return an entries array. However, the Flow definitions
         * for GroupCollection and UserCollection mark "entries" as optional, so we still need to test
         * for the hypothetical case in which the entries array is undefined.
         */
        test.each`
            groupsResponse                      | usersResponse                 | resolvedResponse                          | description
            ${undefined}                        | ${undefined}                  | ${[]}                                     | ${'both responses are undefined'}
            ${{}}                               | ${{}}                         | ${[]}                                     | ${'both responses are defined, but do not contain an entries array'}
            ${undefined}                        | ${MOCK_CONTACTS_API_RESPONSE} | ${MOCK_CONTACTS_CONVERTED_RESPONSE}       | ${'users response is defined, and groups response is undefined'}
            ${MOCK_GROUP_CONTACTS_API_RESPONSE} | ${undefined}                  | ${MOCK_GROUP_CONTACTS_CONVERTED_RESPONSE} | ${'groups response is defined, and users response is undefined'}
        `(
            'should set the value of getContacts() when $description',
            ({ groupsResponse, usersResponse, resolvedResponse }) => {
                getGroupsInEnterprise = jest.fn().mockImplementation((itemID, getGroupsInEnterpriseSuccess) => {
                    return getGroupsInEnterpriseSuccess(groupsResponse);
                });
                getUsersInEnterprise = jest.fn().mockImplementation((itemID, getUsersInEnterpriseSuccess) => {
                    return getUsersInEnterpriseSuccess(usersResponse);
                });
                mockAPI = createAPIMock({ getGroupsInEnterprise }, { getUsersInEnterprise });
                let fakeComponent;

                act(() => {
                    fakeComponent = mount(
                        <FakeComponent
                            api={mockAPI}
                            transformGroups={transformGroupsSpy}
                            transformUsers={transformUsersSpy}
                        />,
                    );
                });
                fakeComponent.update();

                const btn = fakeComponent.find('button');
                expect(btn.prop('onClick')).toBeDefined();
                const contacts = btn.invoke('onClick')(MOCK_FILTER);

                return expect(contacts).resolves.toEqual(resolvedResponse);
            },
        );
    });

    describe('with failed API calls', () => {
        beforeAll(() => {
            getGroupsInEnterprise = jest
                .fn()
                .mockImplementation((itemID, getGroupsInEnterpriseSuccess, getGroupsInEnterpriseError) => {
                    return getGroupsInEnterpriseError();
                });
            getUsersInEnterprise = jest
                .fn()
                .mockImplementation((itemID, getUsersInEnterpriseSuccess, getUsersInEnterpriseError) => {
                    return getUsersInEnterpriseError();
                });
            mockAPI = createAPIMock({ getGroupsInEnterprise }, { getUsersInEnterprise });
        });

        test('should set the value of getContacts() and call handleError() when invoked', () => {
            let fakeComponent;

            act(() => {
                fakeComponent = mount(
                    <FakeComponent
                        api={mockAPI}
                        transformGroups={transformGroupsSpy}
                        transformUsers={transformUsersSpy}
                    />,
                );
            });
            fakeComponent.update();

            const btn = fakeComponent.find('button');
            expect(btn.prop('onClick')).toBeDefined();

            const contacts = btn.invoke('onClick')(MOCK_FILTER);
            expect(getUsersInEnterprise).toHaveBeenCalledWith(
                MOCK_ITEM_ID,
                expect.anything(Function),
                expect.anything(Function),
                { filter_term: MOCK_FILTER },
            );
            expect(getGroupsInEnterprise).toHaveBeenCalledWith(
                MOCK_ITEM_ID,
                expect.anything(Function),
                expect.anything(Function),
                { fields: 'name,permissions', filter_term: MOCK_FILTER },
            );
            expect(handleError).toHaveBeenCalled();
            expect(contacts).resolves.toBeFalsy();
        });
    });
});
