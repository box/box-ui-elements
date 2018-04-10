import FileAccessStats from '../FileAccessStats';

let accessStats;
const accessStatsResponse = {
    preview_count: 0,
    comment_count: 0,
    download_count: 0,
    edit_count: 0,
    has_count_overflowed: false
};

describe('api/Versions', () => {
    beforeEach(() => {
        accessStats = new FileAccessStats({});
    });

    describe('getUrl()', () => {
        test('should throw when access stats api url without id', () => {
            expect(() => {
                accessStats.getUrl();
            }).toThrow();
        });
        test('should return correct version api url with id', () => {
            expect(accessStats.getUrl('foo')).toBe('https://api.box.com/2.0/file_access_stats/foo');
        });
    });

    describe('accessStats()', () => {
        test('should not do anything if destroyed', () => {
            accessStats.isDestroyed = jest.fn().mockReturnValueOnce(true);
            accessStats.xhr = null;

            const successCb = jest.fn();
            const errorCb = jest.fn();

            return accessStats.accessStats('id', successCb, errorCb).catch(() => {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
            });
        });

        test('should make xhr to get access stats and call success callback', () => {
            accessStats.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.resolve({ data: accessStatsResponse }))
            };

            const successCb = jest.fn();

            return accessStats.accessStats('id', successCb).then(() => {
                expect(successCb).toHaveBeenCalledWith(accessStatsResponse);
                expect(accessStats.xhr.get).toHaveBeenCalledWith({
                    id: 'file_id',
                    url: 'https://api.box.com/2.0/file_access_stats/id'
                });
            });
        });

        test('should call error callback when xhr fails', () => {
            const error = new Error('error');
            accessStats.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.reject(error))
            };

            const successCb = jest.fn();
            const errorCb = jest.fn();

            return accessStats.accessStats('id', successCb, errorCb).then(() => {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).toHaveBeenCalledWith(error);
                expect(accessStats.xhr.get).toHaveBeenCalledWith({
                    id: 'file_id',
                    url: 'https://api.box.com/2.0/file_access_stats/id'
                });
            });
        });
    });
});
