import OpenWith from '../OpenWith';

let openWith;

const openWithItems = {
    items: [
        {
            display_order: 2,
            icon: 'icon2',
            is_disabled: true,
            disabled_reasons: ['manually disabled'],
            app_integration: {
                id: 2,
                type: 'app_integration'
            }
        },
        {
            display_order: 1,
            icon: 'icon',
            is_disabled: false,
            disabled_reasons: [],
            app_integration: {
                id: 1,
                type: 'app_integration'
            }
        }
    ]
};

const mockAppIntegrations = [
    {
        title: 'Google',
        description: 'a Google integration',
        id: 1,
        type: 'app_integration'
    },
    {
        title: 'Adobe',
        description: 'an Adobe integration',
        id: 2,
        type: 'app_integration'
    }
];

const completeOpenWithItems = [
    {
        display_order: 2,
        icon: 'icon2',
        is_disabled: true,
        disabled_reasons: ['manually disabled'],
        app_integration: mockAppIntegrations[1]
    },
    {
        display_order: 1,
        icon: 'icon',
        is_disabled: false,
        disabled_reasons: [],
        app_integration: mockAppIntegrations[0]
    }
];

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
    });

    describe('getOpenWithIntegrations()', () => {
        test('should format and fetch app integrations on success', () => {
            const openWithData = 'openWithIntegrations';
            const formatedOpenWithIntegrations = 'formattedOpenWithIntegrations';
            const successFn = jest.fn();
            const errorFn = jest.fn();
            openWith.get = ({ successCallback }) => {
                successCallback(openWithData);
            };

            openWith.formatOpenWithData = jest.fn().mockReturnValue(formatedOpenWithIntegrations);
            openWith.fetchAppIntegrations = jest.fn();

            openWith.getOpenWithIntegrations('123', successFn, errorFn);
            expect(openWith.formatOpenWithData).toBeCalledWith(openWithData);
            expect(openWith.fetchAppIntegrations).toBeCalledWith(formatedOpenWithIntegrations, successFn, errorFn);
        });
    });

    describe('formatOpenWithData()', () => {
        test('should replace the app integration ID with a string', () => {
            const formatedOpenWithIntegrations = openWith.formatOpenWithData(openWithItems);
            expect(typeof formatedOpenWithIntegrations[0].app_integration.id).toBe('string');
        });

        test('should sort the integrations based on display order', () => {
            const formatedOpenWithIntegrations = openWith.formatOpenWithData(openWithItems);
            expect(formatedOpenWithIntegrations[0].app_integration.id).toBe('1');
        });
    });

    describe('fetchAppIntegrations()', () => {
        const successFn = jest.fn();
        const errorFn = jest.fn();

        test('should add a promise to get each full app integration object', () => {
            openWith.fetchAppIntegrations(openWithItems.items, successFn, errorFn);
            expect(openWith.appIntegrationsAPI.fetchAppIntegrationsPromise).toBeCalledTimes(2);
        });

        test('should complete the open with objects when the data is successfully returned', async () => {
            openWith.completeOpenWithIntegrationData = jest.fn();
            await openWith.fetchAppIntegrations(openWithItems.items, successFn, errorFn);
            expect(openWith.completeOpenWithIntegrationData).toBeCalled();
            expect(successFn).toBeCalled();
        });

        test('should call the error callback if a promise is rejected', async () => {
            mockFetchAppIntegrationsPromise = () => Promise.reject();
            await openWith.fetchAppIntegrations(openWithItems.items, successFn, errorFn);
            expect(successFn).not.toBeCalled();
            expect(errorFn).toBeCalled();
        });
    });

    describe('completeOpenWithIntegrationData()', () => {
        test('should replace the app integration mini item with the correct object', () => {
            const result = openWith.completeOpenWithIntegrationData(openWithItems.items, mockAppIntegrations);
            expect(result).toEqual(completeOpenWithItems);
        });
    });
});
