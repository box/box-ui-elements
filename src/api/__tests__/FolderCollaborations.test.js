import FolderCollaborations from '../FolderCollaborations';

let folderCollaborations;

describe('api/FolderCollaborations', () => {
    beforeEach(() => {
        folderCollaborations = new FolderCollaborations({});
    });

    describe('getUrl()', () => {
        test('should throw when a folder ID is not provided', () => {
            expect(() => {
                folderCollaborations.getUrl();
            }).toThrow();
        });

        test('should return the correct collaborations API URL with the provided ID', () => {
            const MOCK_FOLDER_ID = '14237093';
            expect(folderCollaborations.getUrl(MOCK_FOLDER_ID)).toBe(
                `https://api.box.com/2.0/folders/${MOCK_FOLDER_ID}/collaborations`,
            );
        });
    });
});
