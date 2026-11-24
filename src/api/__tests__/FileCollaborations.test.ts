import FileCollaborations from '../FileCollaborations';
import type { APIOptions } from '../../common/types/api';

let fileCollaborations: FileCollaborations;

describe('api/FileCollaborations', () => {
    beforeEach(() => {
        fileCollaborations = new FileCollaborations({} as APIOptions);
    });

    describe('getUrl()', () => {
        test('should throw when a file ID is not provided', () => {
            expect(() => {
                fileCollaborations.getUrl(undefined);
            }).toThrow();
        });

        test('should return the correct collaborations API URL with the provided ID', () => {
            const MOCK_FILE_ID = '14237093';
            expect(fileCollaborations.getUrl(MOCK_FILE_ID)).toBe(
                `https://api.box.com/2.0/files/${MOCK_FILE_ID}/collaborations`,
            );
        });
    });
});
