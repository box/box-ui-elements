// @flow

import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import API from '../../../api';
import useContacts from '../hooks/useContacts';
import {
    MOCK_CONTACTS_API_RESPONSE,
    MOCK_CONTACTS_CONVERTED_RESPONSE,
    MOCK_ITEM_ID,
} from '../../../features/unified-share-modal/utils/__mocks__/USMMocks';

const handleSuccess = jest.fn();
const handleError = jest.fn();
const transformResponseSpy = jest.fn().mockReturnValue(MOCK_CONTACTS_CONVERTED_RESPONSE);

function FakeComponent({ api, transformResponse }: { api: API, transformResponse: Function }) {
    const [getContacts, setGetContacts] = React.useState(null);

    const updatedGetContactsFn = useContacts(api, MOCK_ITEM_ID, { handleSuccess, handleError, transformResponse });

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
    let getUsersInEnterprise;
    let mockAPI;

    describe('with successful API calls', () => {
        beforeAll(() => {
            getUsersInEnterprise = jest.fn().mockImplementation((itemID, getUsersInEnterpriseSuccess) => {
                return getUsersInEnterpriseSuccess(MOCK_CONTACTS_API_RESPONSE);
            });
            mockAPI = {
                getUsersAPI: jest.fn().mockReturnValue({
                    getUsersInEnterprise,
                }),
            };
        });

        test('should set the value of getContacts() and retrieve contacts on invocation', () => {
            let fakeComponent;

            act(() => {
                fakeComponent = mount(<FakeComponent api={mockAPI} transformResponse={transformResponseSpy} />);
            });
            fakeComponent.update();

            const btn = fakeComponent.find('button');
            expect(btn.prop('onClick')).toBeDefined();

            const contacts = btn.invoke('onClick')(MOCK_FILTER);

            expect(getUsersInEnterprise).toHaveBeenCalledWith(
                MOCK_ITEM_ID,
                expect.anything(Function),
                expect.anything(Function),
                MOCK_FILTER,
            );
            expect(handleSuccess).toHaveBeenCalledWith(MOCK_CONTACTS_API_RESPONSE);
            expect(transformResponseSpy).toHaveBeenCalledWith(MOCK_CONTACTS_API_RESPONSE);
            return expect(contacts).resolves.toEqual(MOCK_CONTACTS_CONVERTED_RESPONSE);
        });

        test('should return the API data if transformResponse() is not provided', () => {
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
                MOCK_FILTER,
            );
            expect(handleSuccess).toHaveBeenCalledWith(MOCK_CONTACTS_API_RESPONSE);
            expect(transformResponseSpy).not.toHaveBeenCalled();
            return expect(contacts).resolves.toEqual(MOCK_CONTACTS_API_RESPONSE);
        });
    });

    describe('with failed API calls', () => {
        beforeAll(() => {
            getUsersInEnterprise = jest
                .fn()
                .mockImplementation((itemID, getUsersInEnterpriseSuccess, getUsersInEnterpriseError) => {
                    return getUsersInEnterpriseError();
                });
            mockAPI = {
                getUsersAPI: jest.fn().mockReturnValue({
                    getUsersInEnterprise,
                }),
            };
        });

        test('should set the value of getContacts() and call handleError() when invoked', () => {
            let fakeComponent;

            act(() => {
                fakeComponent = mount(<FakeComponent api={mockAPI} transformResponse={transformResponseSpy} />);
            });
            fakeComponent.update();

            const btn = fakeComponent.find('button');
            expect(btn.prop('onClick')).toBeDefined();

            const contacts = btn.invoke('onClick')(MOCK_FILTER);
            expect(getUsersInEnterprise).toHaveBeenCalledWith(
                MOCK_ITEM_ID,
                expect.anything(Function),
                expect.anything(Function),
                MOCK_FILTER,
            );
            expect(handleError).toHaveBeenCalled();
            expect(contacts).resolves.toBeFalsy();
        });
    });
});
