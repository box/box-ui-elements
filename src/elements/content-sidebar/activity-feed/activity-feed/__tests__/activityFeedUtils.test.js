import { collapseFeedState } from '../activityFeedUtils';
import { PLACEHOLDER_USER } from '../../../../../constants';

describe('collapseFeedState', () => {
    const mario = { id: '1', name: 'mario' };
    const luigi = { id: '2', name: 'luigi' };

    const version1 = {
        type: 'file_version',
        version_number: '2',
        modified_by: mario,
    };

    test('should return empty array if no input', () => {
        expect(collapseFeedState()).toEqual([]);
    });

    test('should keep file_version & comment distinct', () => {
        const origFeed = [
            {
                type: 'comment',
            },
            {
                type: 'file_version',
            },
        ];
        const expFeed = origFeed;
        const collapsedFeed = collapseFeedState(origFeed);

        expect(collapsedFeed).toEqual(expFeed);
    });

    test('should collapse two file_version items into 1', () => {
        const version2 = {
            type: 'file_version',
            version_number: '1',
            modified_by: luigi,
        };

        const origFeed = [version1, version2];
        const expFeed = [
            {
                type: 'file_version',
                version_number: '1',
                modified_by: luigi,
                created_at: undefined,
                id: undefined,
                trashed_at: undefined,
                version_start: 1,
                version_end: 2,
                collaborators: {
                    '1': mario,
                    '2': luigi,
                },
                versions: [version1, version2],
            },
        ];

        const collapsedFeed = collapseFeedState(origFeed);

        expect(collapsedFeed).toEqual(expFeed);
    });

    test('should collapse two file_version items and handle null users', () => {
        const version2 = {
            type: 'file_version',
            version_number: '1',
            modified_by: null,
        };

        const origFeed = [version1, version2];
        const expFeed = [
            {
                type: 'file_version',
                version_number: '1',
                modified_by: PLACEHOLDER_USER,
                created_at: undefined,
                id: undefined,
                trashed_at: undefined,
                version_start: 1,
                version_end: 2,
                collaborators: {
                    '1': mario,
                    '2': PLACEHOLDER_USER,
                },
                versions: [version1, version2],
            },
        ];

        const collapsedFeed = collapseFeedState(origFeed);

        expect(collapsedFeed).toEqual(expFeed);
    });
});
