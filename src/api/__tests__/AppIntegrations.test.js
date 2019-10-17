import AppIntegrations from '../AppIntegrations';

let appIntegrations;

describe('api/AppIntegrations', () => {
    beforeEach(() => {
        appIntegrations = new AppIntegrations({});
    });

    describe('getUrl()', () => {
        test('should throw when version api url without id', () => {
            expect(() => {
                appIntegrations.getUrl();
            }).toThrow();
        });
        test('should return correct app integrations api url with id', () => {
            expect(appIntegrations.getUrl('foo')).toBe('https://api.box.com/2.0/app_integrations/foo');
        });
    });

    describe('execute()', () => {
        test('should throw an error if the integration ID or file ID is missing', () => {
            expect(() => {
                appIntegrations.execute(null, '1234', () => {});
            }).toThrow();

            expect(() => {
                appIntegrations.execute('1234', null, () => {});
            }).toThrow();
        });

        test('should make a POST request with the correct data', () => {
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            const fileID = '1234';
            const url = `${appIntegrations.getUrl('5678')}/execute`;
            const body = {
                data: {
                    item: {
                        type: 'file',
                        id: fileID,
                    },
                },
            };
            appIntegrations.post = jest.fn();

            appIntegrations.execute('5678', '1234', successCallback, errorCallback);
            expect(appIntegrations.post).toBeCalledWith({
                id: fileID,
                url,
                data: body,
                successCallback,
                errorCallback,
            });
        });
    });
});
