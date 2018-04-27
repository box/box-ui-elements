import FileAccessStats from '../FileAccessStats';

let accessStats;

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
});
