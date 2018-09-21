import OpenWith from '../OpenWith';
import mockOpenWithData from './MockOpenWithData.json';

let openWith;

describe('api/ContentOpenWith', () => {
    beforeEach(() => {
        openWith = new OpenWith({});
    });

    describe('getOpenWithIntegrations()', () => {
        test('should format data on success', () => {
            const successFn = jest.fn();
            const errorFn = jest.fn();
            openWith.get = ({ successCallback }) => {
                successCallback(mockOpenWithData);
            };

            openWith.formatOpenWithData = jest.fn();

            openWith.getOpenWithIntegrations('123', successFn, errorFn);
            expect(openWith.formatOpenWithData).toBeCalledWith(
                mockOpenWithData,
            );
        });
    });

    describe('formatOpenWithData()', () => {
        test('should add a flattened and complete Integration', () => {
            const formatedOpenWithIntegrations = openWith.formatOpenWithData(
                mockOpenWithData,
            );
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
            const formatedOpenWithIntegrations = openWith.formatOpenWithData(
                mockOpenWithData,
            );
            formatedOpenWithIntegrations.forEach(integration => {
                expect(typeof integration.isDefault).toBe('boolean');
            });
        });

        test('should return items sorted by displayOrder', () => {
            const formatedOpenWithIntegrations = openWith.formatOpenWithData(
                mockOpenWithData,
            );
            formatedOpenWithIntegrations.forEach((integration, idx) => {
                // displayOrder is 1 indexed
                const expectedOrder = idx + 1;
                expect(integration.displayOrder).toEqual(expectedOrder);
            });
        });
    });
});
