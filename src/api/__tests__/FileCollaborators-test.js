import FileCollaborators from '../FileCollaborators';

let accessStats;

describe('api/FileCollaborators', () => {
    beforeEach(() => {
        accessStats = new FileCollaborators({});
    });

    describe('getUrl()', () => {
        test('should throw when collaborators api url without id', () => {
            expect(() => {
                accessStats.getUrl();
            }).toThrow();
        });
        test('should return correct collaborators api url with id', () => {
            expect(accessStats.getUrl('foo')).toBe('https://api.box.com/2.0/files/foo/collaborators');
        });
    });
});
