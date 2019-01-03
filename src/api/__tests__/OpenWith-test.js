import OpenWith from '../OpenWith';
import mockOpenWithData from './MockOpenWithData.json';

let openWith;

describe('api/ContentOpenWith', () => {
    beforeEach(() => {
        openWith = new OpenWith({});
    });

    describe('getOpenWithIntegrations()', () => {
        test('should format data on success', () => {
            const data = mockOpenWithData.default;
            const successFn = jest.fn();
            const errorFn = jest.fn();
            openWith.get = ({ successCallback }) => {
                successCallback(data);
            };

            openWith.formatOpenWithData = jest.fn();
            openWith.consolidateBoxEditIntegrations = jest.fn();

            openWith.getOpenWithIntegrations('123', successFn, errorFn);
            expect(openWith.formatOpenWithData).toBeCalledWith(data);
            expect(openWith.consolidateBoxEditIntegrations).toBeCalled();
        });
    });

    describe('consolidateBoxEditIntegrations()', () => {
        test('should do nothing if no Box Edit integrations are present', () => {
            const data = mockOpenWithData.default.items;
            const result = openWith.consolidateBoxEditIntegrations(data);
            expect(result).toEqual(data);
        });

        test('should do nothing if only Box Edit is present', () => {
            const data = mockOpenWithData.boxEdit;
            const result = openWith.consolidateBoxEditIntegrations(data);
            expect(result).toEqual(data);
        });
        test('should do nothing if only Box Edit SFC is present', () => {
            const data = mockOpenWithData.boxEditSFC;
            const result = openWith.consolidateBoxEditIntegrations(data);
            expect(result).toEqual(data);
        });
        test('should only return Box Edit if both Box Edit AND Box Edit SFC are present', () => {
            const data = mockOpenWithData.boxEditAndSFC;
            const result = openWith.consolidateBoxEditIntegrations(data);
            expect(result).toEqual(mockOpenWithData.boxEdit);
        });
    });

    describe('formatOpenWithData()', () => {
        const data = mockOpenWithData.default;
        test('should add a flattened and complete Integration', () => {
            const formatedOpenWithIntegrations = openWith.formatOpenWithData(data);
            formatedOpenWithIntegrations.forEach(integration => {
                expect(typeof integration.appIntegrationId).toBe('string');
                expect(typeof integration.displayDescription).toBe('string');
                expect(typeof integration.disabledReasons).toBe('object');
                expect(typeof integration.displayOrder).toBe('number');
                expect(typeof integration.isDisabled).toBe('boolean');
                expect(typeof integration.displayName).toBe('string');
                expect(typeof integration.requiresConsent).toBe('boolean');
                expect(typeof integration.type).toBe('string');
            });
        });

        test('should add isDefault to all items', () => {
            const formatedOpenWithIntegrations = openWith.formatOpenWithData(data);
            formatedOpenWithIntegrations.forEach(integration => {
                expect(typeof integration.isDefault).toBe('boolean');
            });
        });

        test('should return items sorted by displayOrder', () => {
            const formatedOpenWithIntegrations = openWith.formatOpenWithData(data);
            formatedOpenWithIntegrations.forEach((integration, idx) => {
                // displayOrder is 1 indexed
                const expectedOrder = idx + 1;
                expect(integration.displayOrder).toEqual(expectedOrder);
            });
        });
    });
});
