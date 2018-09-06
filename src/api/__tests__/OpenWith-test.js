import OpenWith from '../OpenWith';

let openWith;
let mockOpenWithItems;
let mockOpenWithIntegrationsWithDefault;
let mockDefaultOpenWithIntegration;
let mockAppIntegrations;
let completeOpenWithItems;

let mockFetchAppIntegrationsPromise = (id) =>
    Promise.resolve(mockAppIntegrations.find((mockAppIntegration) => mockAppIntegration.id === id));

jest.mock('../AppIntegrations', () =>
    jest.fn().mockImplementation(() => ({
        fetchAppIntegrationsPromise: jest.fn().mockImplementation(mockFetchAppIntegrationsPromise)
    }))
);

describe('api/OpenWith', () => {
    beforeEach(() => {
        openWith = new OpenWith({});
        mockOpenWithItems = {
            items: [
                {
                    display_order: 2,
                    icon: 'icon2',
                    is_disabled: true,
                    disabled_reasons: ['manually disabled'],
                    should_show_consent_popup: false,
                    app_integration: {
                        id: '2',
                        type: 'app_integration'
                    }
                },
                {
                    display_order: 1,
                    icon: 'icon',
                    is_disabled: false,
                    disabled_reasons: [],
                    should_show_consent_popup: false,
                    app_integration: {
                        id: '1',
                        type: 'app_integration'
                    }
                }
            ]
        };

        mockDefaultOpenWithIntegration = {
            display_order: 3,
            icon: 'icon',
            is_disabled: false,
            disabled_reasons: [],
            should_show_consent_popup: false,
            default_app_integration: {
                id: '3',
                type: 'app_integration'
            }
        };

        mockAppIntegrations = [
            {
                description: 'a Google integration',
                id: '1',
                name: 'Google',
                type: 'app_integration'
            },
            {
                description: 'an Adobe integration',
                id: '2',
                name: 'Adobe',
                type: 'app_integration'
            }
        ];

        mockOpenWithIntegrationsWithDefault = [
            ...mockOpenWithItems.items,
            {
                display_order: 3,
                icon: 'icon',
                is_disabled: false,
                is_default: true,
                disabled_reasons: [],
                should_show_consent_popup: false,
                app_integration: {
                    id: '3',
                    type: 'app_integration'
                }
            }
        ];

        completeOpenWithItems = [
            {
                display_order: 2,
                icon: 'icon2',
                is_disabled: true,
                disabled_reasons: ['manually disabled'],
                app_integration: mockAppIntegrations[1],
                should_show_consent_popup: false
            },
            {
                display_order: 1,
                icon: 'icon',
                is_disabled: false,
                disabled_reasons: [],
                app_integration: mockAppIntegrations[0],
                should_show_consent_popup: false
            }
        ];
    });

    describe('getOpenWithIntegrations()', () => {
        test('should fetch app integrations on success', () => {
            const openWithData = 'openWithIntegrations';
            const successFn = jest.fn();
            const errorFn = jest.fn();
            openWith.get = ({ successCallback }) => {
                successCallback(openWithData);
            };

            openWith.fetchAppIntegrations = jest.fn();

            openWith.getOpenWithIntegrations('123', successFn, errorFn);
            expect(openWith.fetchAppIntegrations).toBeCalledWith(openWithData, successFn, errorFn);
        });
    });

    describe('fetchAppIntegrations()', () => {
        const successFn = jest.fn();
        const errorFn = jest.fn();

        beforeEach(() => {
            openWith.addDefaultToOpenWithItems = jest.fn().mockReturnValue(mockOpenWithIntegrationsWithDefault);
            openWith.completeOpenWithIntegrationData = jest.fn();
            openWith.formatOpenWithData = jest.fn();
        });

        test('should add potential default integration to list of items', () => {
            openWith.fetchAppIntegrations(mockOpenWithItems.items, successFn, errorFn);
            expect(openWith.addDefaultToOpenWithItems).toBeCalled();
        });

        test('should add a promise to get each full app integration object', () => {
            openWith.fetchAppIntegrations(mockOpenWithItems.items, successFn, errorFn);
            expect(openWith.appIntegrationsAPI.fetchAppIntegrationsPromise).toBeCalledTimes(3);
        });

        test('should complete and format the open with objects when the data is successfully returned', async () => {
            openWith.completeOpenWithIntegrationData = jest.fn();
            await openWith.fetchAppIntegrations(mockOpenWithItems.items, successFn, errorFn);
            expect(openWith.completeOpenWithIntegrationData).toBeCalled();
            expect(openWith.formatOpenWithData).toBeCalled();

            expect(successFn).toBeCalled();
        });

        test('should call the error callback if a promise is rejected', async () => {
            mockFetchAppIntegrationsPromise = () => Promise.reject();
            await openWith.fetchAppIntegrations(mockOpenWithItems.items, successFn, errorFn);
            expect(successFn).not.toBeCalled();
            expect(errorFn).toBeCalled();
        });
    });

    describe('addDefaultToOpenWithItems()', () => {
        test('should just return the list of items if there is no default integration', () => {
            const result = openWith.addDefaultToOpenWithItems(mockOpenWithItems);
            expect(result).toEqual(mockOpenWithItems.items);
        });

        test('should add the default integration and return a list of integration items', () => {
            const openWithObject = {
                ...mockDefaultOpenWithIntegration,
                ...mockOpenWithItems
            };

            const result = openWith.addDefaultToOpenWithItems(openWithObject);
            expect(result).toEqual(mockOpenWithIntegrationsWithDefault);
        });
    });

    describe('formatOpenWithData()', () => {
        test('should add a flattened App Integration', () => {
            const formatedOpenWithIntegrations = openWith.formatOpenWithData(mockOpenWithItems.items);
            expect(typeof formatedOpenWithIntegrations[0].appIntegrationId).toBe('string');
        });

        test('should add is_default to all items', () => {
            const formatedOpenWithIntegrations = openWith.formatOpenWithData(mockOpenWithItems.items);
            expect(typeof formatedOpenWithIntegrations[0].isDefault).toBe('boolean');
        });

        test('should return items sorted by displayOrder', () => {
            const formatedOpenWithIntegrations = openWith.formatOpenWithData(mockOpenWithItems.items);
            // 2 integrations with ids 1 and 2
            expect(formatedOpenWithIntegrations[0].displayOrder).toBe(1);
            expect(formatedOpenWithIntegrations[1].displayOrder).toBe(2);
        });
    });

    describe('completeOpenWithIntegrationData()', () => {
        test('should replace the app integration mini items with the correct object', () => {
            const result = openWith.completeOpenWithIntegrationData(mockOpenWithItems.items, mockAppIntegrations);
            expect(result).toEqual(completeOpenWithItems);
        });
    });
});
