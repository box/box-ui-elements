import { STATUS_INACTIVE } from '../../../../constants';
import {
    convertUserContactsResponse,
    convertGroupContactsResponse,
    convertUserContactByEmailResponse,
} from '../convertContactServiceData';

const mockCurrentUserId = '123';

describe('elements/content-sharing/utils/convertContactServiceData', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('convertUserContactsResponse', () => {
        describe('basic conversion', () => {
            test('should return empty array when entries is empty', () => {
                const contactsApiData = { entries: [] };
                const result = convertUserContactsResponse(contactsApiData, mockCurrentUserId);
                expect(result).toEqual([]);
            });

            test('should convert valid user contacts correctly', () => {
                const contactsApiData = {
                    entries: [
                        {
                            id: 'user-1',
                            login: 'jane.smith@example.com',
                            name: 'Jane Smith',
                            type: 'user',
                            status: 'active',
                        },
                        {
                            id: 'user-2',
                            login: 'john.doe@example.com',
                            name: 'John Doe',
                            type: 'user',
                            status: 'active',
                        },
                    ],
                };

                const result = convertUserContactsResponse(contactsApiData, mockCurrentUserId);

                expect(result).toEqual([
                    {
                        id: 'user-1',
                        email: 'jane.smith@example.com',
                        name: 'Jane Smith',
                        type: 'user',
                        value: 'jane.smith@example.com',
                    },
                    {
                        id: 'user-2',
                        email: 'john.doe@example.com',
                        name: 'John Doe',
                        type: 'user',
                        value: 'john.doe@example.com',
                    },
                ]);
            });
        });

        describe('filtering logic', () => {
            test('should filter out current user', () => {
                const contactsApiData = {
                    entries: [
                        {
                            id: mockCurrentUserId,
                            login: 'current.user@example.com',
                            name: 'Current User',
                            type: 'user',
                            status: 'active',
                        },
                        {
                            id: 'user-1',
                            login: 'other.user@example.com',
                            name: 'Other User',
                            type: 'user',
                            status: 'active',
                        },
                    ],
                };

                const result = convertUserContactsResponse(contactsApiData, mockCurrentUserId);

                expect(result).toHaveLength(1);
                expect(result[0].id).toBe('user-1');
            });

            test('should filter out app users (boxdevedition.com domain)', () => {
                const contactsApiData = {
                    entries: [
                        {
                            id: 'app-user-1',
                            login: 'app@boxdevedition.com',
                            name: 'App User',
                            type: 'user',
                            status: 'active',
                        },
                        {
                            id: 'user-1',
                            login: 'regular.user@example.com',
                            name: 'Regular User',
                            type: 'user',
                            status: 'active',
                        },
                    ],
                };

                const result = convertUserContactsResponse(contactsApiData, mockCurrentUserId);

                expect(result).toHaveLength(1);
                expect(result[0].id).toBe('user-1');
            });

            test.each([null, STATUS_INACTIVE])('should filter out users with invalid status', status => {
                const contactsApiData = {
                    entries: [
                        {
                            id: 'inactive-user',
                            login: 'inactive@example.com',
                            name: 'Inactive User',
                            type: 'user',
                            status,
                        },
                        {
                            id: 'active-user',
                            login: 'active@example.com',
                            name: 'Active User',
                            type: 'user',
                            status: 'active',
                        },
                    ],
                };

                const result = convertUserContactsResponse(contactsApiData, mockCurrentUserId);

                expect(result).toHaveLength(1);
                expect(result[0].id).toBe('active-user');
            });

            test('should filter out users without email', () => {
                const contactsApiData = {
                    entries: [
                        {
                            id: 'no-email-user',
                            login: null,
                            name: 'No Email User',
                            type: 'user',
                            status: 'active',
                        },
                        {
                            id: 'user-with-email',
                            login: 'with.email@example.com',
                            name: 'User With Email',
                            type: 'user',
                            status: 'active',
                        },
                    ],
                };

                const result = convertUserContactsResponse(contactsApiData, mockCurrentUserId);

                expect(result).toHaveLength(1);
                expect(result[0].id).toBe('user-with-email');
            });
        });

        test('should sort contacts by name alphabetically', () => {
            const contactsApiData = {
                entries: [
                    {
                        id: 'user-3',
                        login: 'charlie@example.com',
                        name: 'Charlie Brown',
                        type: 'user',
                        status: 'active',
                    },
                    {
                        id: 'user-1',
                        login: 'alice@example.com',
                        name: 'Alice Wonder',
                        type: 'user',
                        status: 'active',
                    },
                    {
                        id: 'user-2',
                        login: 'bob@example.com',
                        name: 'Bob Builder',
                        type: 'user',
                        status: 'active',
                    },
                ],
            };

            const result = convertUserContactsResponse(contactsApiData, mockCurrentUserId);

            expect(result).toHaveLength(3);
            expect(result[0].name).toBe('Alice Wonder');
            expect(result[1].name).toBe('Bob Builder');
            expect(result[2].name).toBe('Charlie Brown');
        });
    });

    describe('convertGroupContactsResponse', () => {
        describe('basic conversion', () => {
            test('should return empty array when entries is empty', () => {
                const contactsApiData = { entries: [] };
                const result = convertGroupContactsResponse(contactsApiData);
                expect(result).toEqual([]);
            });

            test('should convert valid group contacts correctly', () => {
                const contactsApiData = {
                    entries: [
                        {
                            id: 'group-1',
                            name: 'Engineering Team',
                            type: 'group',
                            permissions: {
                                can_invite_as_collaborator: true,
                            },
                        },
                        {
                            id: 'group-2',
                            name: 'Marketing Team',
                            type: 'group',
                            permissions: {
                                can_invite_as_collaborator: true,
                            },
                        },
                    ],
                };

                const result = convertGroupContactsResponse(contactsApiData);

                expect(result).toEqual([
                    {
                        id: 'group-1',
                        email: 'Group',
                        name: 'Engineering Team',
                        type: 'group',
                        value: 'Group',
                    },
                    {
                        id: 'group-2',
                        email: 'Group',
                        name: 'Marketing Team',
                        type: 'group',
                        value: 'Group',
                    },
                ]);
            });
        });

        describe('filtering logic', () => {
            test('should filter out groups without can_invite_as_collaborator permission', () => {
                const contactsApiData = {
                    entries: [
                        {
                            id: 'group-1',
                            name: 'Marketing Team',
                            type: 'group',
                            permissions: {
                                can_invite_as_collaborator: false,
                            },
                        },
                        {
                            id: 'group-2',
                            name: 'Marketing Team',
                            type: 'group',
                        },
                        {
                            id: 'group-3',
                            name: 'Marketing Team',
                            type: 'group',
                            permissions: {},
                        },
                        {
                            id: 'group-4',
                            name: 'Engineering Team',
                            type: 'group',
                            permissions: {
                                can_invite_as_collaborator: true,
                            },
                        },
                    ],
                };

                const result = convertGroupContactsResponse(contactsApiData);

                expect(result).toHaveLength(1);
                expect(result[0].id).toBe('group-4');
            });
        });

        test('should sort groups by name alphabetically', () => {
            const contactsApiData = {
                entries: [
                    {
                        id: 'group-3',
                        name: 'Charlie Group',
                        type: 'group',
                        permissions: {
                            can_invite_as_collaborator: true,
                        },
                    },
                    {
                        id: 'group-1',
                        name: 'Alice Group',
                        type: 'group',
                        permissions: {
                            can_invite_as_collaborator: true,
                        },
                    },
                    {
                        id: 'group-2',
                        name: 'Bob Group',
                        type: 'group',
                        permissions: {
                            can_invite_as_collaborator: true,
                        },
                    },
                ],
            };

            const result = convertGroupContactsResponse(contactsApiData);

            expect(result).toHaveLength(3);
            expect(result[0].name).toBe('Alice Group');
            expect(result[1].name).toBe('Bob Group');
            expect(result[2].name).toBe('Charlie Group');
        });
    });

    describe('convertUserContactByEmailResponse', () => {
        describe('basic conversion', () => {
            test('should return empty object when entries is empty', () => {
                const contactsApiData = { entries: [] };
                const result = convertUserContactByEmailResponse(contactsApiData);
                expect(result).toEqual({});
            });

            test('should convert valid user contact correctly', () => {
                const contactsApiData = {
                    entries: [
                        {
                            id: 'user-1',
                            login: 'jane.smith@example.com',
                            name: 'Jane Smith',
                            type: 'user',
                        },
                    ],
                };

                const result = convertUserContactByEmailResponse(contactsApiData);

                expect(result).toEqual({
                    id: 'user-1',
                    email: 'jane.smith@example.com',
                    name: 'Jane Smith',
                    type: 'user',
                    value: 'jane.smith@example.com',
                });
            });

            test('should handle user contact with missing login field', () => {
                const contactsApiData = {
                    entries: [
                        {
                            id: 'user-1',
                            name: 'Jane Smith',
                            type: 'user',
                        },
                    ],
                };

                const result = convertUserContactByEmailResponse(contactsApiData);

                expect(result).toEqual({
                    id: 'user-1',
                    email: '',
                    name: 'Jane Smith',
                    type: 'user',
                    value: '',
                });
            });

            test('should handle user contact with undefined login field', () => {
                const contactsApiData = {
                    entries: [
                        {
                            id: 'user-1',
                            name: 'Jane Smith',
                            type: 'user',
                        },
                    ],
                };

                const result = convertUserContactByEmailResponse(contactsApiData);

                expect(result).toEqual({
                    id: 'user-1',
                    email: '',
                    name: 'Jane Smith',
                    type: 'user',
                    value: '',
                });
            });

            test('should handle user contact with undefined login field', () => {
                const contactsApiData = {
                    entries: [
                        {
                            id: 'user-1',
                            login: undefined,
                            name: 'Jane Smith',
                            type: 'user',
                        },
                    ],
                };

                const result = convertUserContactByEmailResponse(contactsApiData);

                expect(result).toEqual({
                    id: 'user-1',
                    email: '',
                    name: 'Jane Smith',
                    type: 'user',
                    value: '',
                });
            });
        });
    });
});
