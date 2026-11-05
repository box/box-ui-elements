import FileAccessStats from '../FileAccessStats';
import type { APIOptions } from '../../common/types/api';

let accessStats: FileAccessStats;

describe('api/FileAccessStats', () => {
    beforeEach(() => {
        accessStats = new FileAccessStats({} as APIOptions);
    });

    describe('getUrl()', () => {
        test('should throw when access stats api url without id', () => {
            expect(() => {
                accessStats.getUrl(undefined);
            }).toThrow();
        });
        test('should return correct access stats api url with id', () => {
            expect(accessStats.getUrl('foo')).toBe('https://api.box.com/2.0/file_access_stats/foo');
        });
    });
});
