// @flow

import { renderHook, act } from '@testing-library/react';
import useContactsByEmail from '../hooks/useContactsByEmail';
import {
    MOCK_CONTACTS_API_RESPONSE,
    MOCK_CONTACTS_BY_EMAIL_CONVERTED_RESPONSE,
    MOCK_ITEM_ID,
} from '../../../features/unified-share-modal/utils/__mocks__/USMMocks';

const handleSuccess = jest.fn();
const handleError = jest.fn();
const mockTransformUsers = jest.fn().mockReturnValue(MOCK_CONTACTS_BY_EMAIL_CONVERTED_RESPONSE);

const createAPIMock = markerBasedUsersAPI => ({
    getMarkerBasedUsersAPI: jest.fn().mockReturnValue(markerBasedUsersAPI),
});

const MOCK_EMAIL = 'contentsharing@box.com';

describe('elements/content-sharing/hooks/useContactsByEmail', () => {
    let getUsersInEnterprise;
    let mockAPI;

    describe('with a successful API call', () => {
        beforeEach(() => {
            getUsersInEnterprise = jest.fn().mockImplementation((itemID, getUsersInEnterpriseSuccess) => {
                return getUsersInEnterpriseSuccess(MOCK_CONTACTS_API_RESPONSE);
            });
            mockAPI = createAPIMock({ getUsersInEnterprise });
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        test('should set the value of getContactsByEmail() and retrieve contacts on invocation', async () => {
            const { result } = renderHook(() =>
                useContactsByEmail(mockAPI, MOCK_ITEM_ID, {
                    handleSuccess,
                    handleError,
                    transformUsers: mockTransformUsers,
                }),
            );

            let contacts;
            await act(async () => {
                contacts = await result.current({ emails: [MOCK_EMAIL] });
            });

            expect(getUsersInEnterprise).toHaveBeenCalledWith(
                MOCK_ITEM_ID,
                expect.anything(Function),
                expect.anything(Function),
                { filter_term: MOCK_EMAIL },
            );
            expect(handleSuccess).toHaveBeenCalledWith(MOCK_CONTACTS_API_RESPONSE);
            expect(mockTransformUsers).toHaveBeenCalledWith(MOCK_CONTACTS_API_RESPONSE);
            expect(contacts).toEqual(MOCK_CONTACTS_BY_EMAIL_CONVERTED_RESPONSE);
        });

        test('should return the entries from the API data if transformUsers() is not provided', async () => {
            const { result } = renderHook(() =>
                useContactsByEmail(mockAPI, MOCK_ITEM_ID, {
                    handleSuccess,
                    handleError,
                }),
            );

            let contacts;
            await act(async () => {
                contacts = await result.current({ emails: [MOCK_EMAIL] });
            });

            expect(getUsersInEnterprise).toHaveBeenCalledWith(
                MOCK_ITEM_ID,
                expect.anything(Function),
                expect.anything(Function),
                { filter_term: MOCK_EMAIL },
            );
            expect(handleSuccess).toHaveBeenCalledWith(MOCK_CONTACTS_API_RESPONSE);
            expect(mockTransformUsers).not.toHaveBeenCalled();
            expect(contacts).toEqual(MOCK_CONTACTS_API_RESPONSE.entries);
        });

        test('should set the value of getContactsByEmail() to an empty object when no results are found', async () => {
            const EMPTY_USERS = { entries: [] };
            getUsersInEnterprise = jest.fn().mockImplementation((itemID, getUsersInEnterpriseSuccess) => {
                return getUsersInEnterpriseSuccess(EMPTY_USERS);
            });
            mockAPI = createAPIMock({ getUsersInEnterprise });

            const { result } = renderHook(() =>
                useContactsByEmail(mockAPI, MOCK_ITEM_ID, {
                    handleSuccess,
                    handleError,
                    transformUsers: mockTransformUsers,
                }),
            );

            let contacts;
            await act(async () => {
                contacts = await result.current({ emails: [MOCK_EMAIL] });
            });

            expect(handleSuccess).toHaveBeenCalledWith(EMPTY_USERS);
            expect(mockTransformUsers).not.toHaveBeenCalled();
            expect(contacts).toEqual({});
        });

        test.each`
            filterTerm                      | description
            ${'contentsharing'}             | ${'not an object'}
            ${{ content: 'sharing' }}       | ${'an object, but does not have an emails key'}
            ${{ emails: 'contentsharing' }} | ${'an object with the emails key, but filterTerm.emails is not an array'}
            ${{ emails: [] }}               | ${'an object with the emails key, but filterTerm.emails is an empty array'}
        `('should return an empty object when filterTerm is $description', async ({ filterTerm }) => {
            const { result } = renderHook(() =>
                useContactsByEmail(mockAPI, MOCK_ITEM_ID, {
                    handleSuccess,
                    handleError,
                }),
            );

            let contacts;
            await act(async () => {
                contacts = await result.current(filterTerm);
            });

            expect(getUsersInEnterprise).not.toHaveBeenCalled();
            expect(handleError).not.toHaveBeenCalled();
            expect(contacts).toEqual({});
        });

        test('should set the value of getContactsByEmail() and retrieve contacts when isContentSharingV2Enabled is true and email is provided', async () => {
            const mockUser1 = MOCK_CONTACTS_API_RESPONSE.entries[0];
            const { id, login: email, name, type } = mockUser1;
            const expectedTransformedResult = {
                id,
                email,
                name,
                type,
                value: email,
            };
            const MOCK_CONTACT_BY_EMAIL_API_RESPONSE = { entries: [mockUser1] };
            const mockTransformUsersV2 = jest.fn().mockReturnValue(expectedTransformedResult);
            getUsersInEnterprise = jest.fn().mockImplementation((itemID, getUsersInEnterpriseSuccess) => {
                return getUsersInEnterpriseSuccess(MOCK_CONTACT_BY_EMAIL_API_RESPONSE);
            });
            mockAPI = createAPIMock({ getUsersInEnterprise });

            const { result } = renderHook(() =>
                useContactsByEmail(mockAPI, MOCK_ITEM_ID, {
                    isContentSharingV2Enabled: true,
                    handleSuccess,
                    handleError,
                    transformUsers: mockTransformUsersV2,
                }),
            );

            let contacts;
            await act(async () => {
                contacts = await result.current('contentopenwith@box.com');
            });

            expect(getUsersInEnterprise).toHaveBeenCalledWith(
                MOCK_ITEM_ID,
                expect.anything(Function),
                expect.anything(Function),
                { filter_term: 'contentopenwith@box.com' },
            );
            expect(handleSuccess).toHaveBeenCalledWith(MOCK_CONTACT_BY_EMAIL_API_RESPONSE);
            expect(mockTransformUsersV2).toHaveBeenCalledWith(MOCK_CONTACT_BY_EMAIL_API_RESPONSE);
            expect(contacts).toEqual(expectedTransformedResult);
        });

        test('should set the value of getContactsByEmail() to an empty object when isContentSharingV2Enabled is true and email is not provided', async () => {
            const EMPTY_USERS = { entries: [] };
            getUsersInEnterprise = jest.fn().mockImplementation((itemID, getUsersInEnterpriseSuccess) => {
                return getUsersInEnterpriseSuccess(EMPTY_USERS);
            });
            mockAPI = createAPIMock({ getUsersInEnterprise });

            const { result } = renderHook(() =>
                useContactsByEmail(mockAPI, MOCK_ITEM_ID, {
                    isContentSharingV2Enabled: true,
                    handleSuccess,
                    handleError,
                    transformUsers: mockTransformUsers,
                }),
            );

            let contacts;
            await act(async () => {
                contacts = await result.current({ emails: [MOCK_EMAIL] });
            });

            expect(handleSuccess).toHaveBeenCalledWith(EMPTY_USERS);
            expect(mockTransformUsers).not.toHaveBeenCalled();
            expect(contacts).toEqual({});
        });
    });

    describe('with a failed API call', () => {
        beforeEach(() => {
            getUsersInEnterprise = jest
                .fn()
                .mockImplementation((itemID, getUsersInEnterpriseSuccess, getUsersInEnterpriseError) => {
                    return getUsersInEnterpriseError();
                });
            mockAPI = createAPIMock({ getUsersInEnterprise });
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        test('should set the value of getContactsByEmail() and call handleError() when invoked', async () => {
            const { result } = renderHook(() =>
                useContactsByEmail(mockAPI, MOCK_ITEM_ID, {
                    handleSuccess,
                    handleError,
                    transformUsers: mockTransformUsers,
                }),
            );

            result.current({ emails: [MOCK_EMAIL] });

            // Wait a short time to ensure handleError is called
            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 100));
            });

            expect(getUsersInEnterprise).toHaveBeenCalledWith(
                MOCK_ITEM_ID,
                expect.anything(Function),
                expect.anything(Function),
                { filter_term: MOCK_EMAIL },
            );
            expect(handleError).toHaveBeenCalled();
        });
    });
});
