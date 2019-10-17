import { sortByActivity, getLastActionTimeMS, determineInteractionMessage } from '../presenceUtils';
import messages from '../../messages';

const MS_IN_A_DAY = 86400000;
const collaboratorList = [
    // Preview
    {
        interactedAt: 2,
        interactionType: 'user.item_preview',
        isActive: false,
    },
    // Preview
    {
        interactedAt: MS_IN_A_DAY,
        interactionType: 'user.item_preview',
        isActive: false,
    },
    // Upload
    {
        interactedAt: MS_IN_A_DAY + 2,
        interactionType: 'user.item_upload',
        isActive: false,
    },
    // Upload
    {
        interactedAt: 0,
        interactionType: 'user.item_upload',
        isActive: true,
    },
    // Preview
    {
        interactedAt: MS_IN_A_DAY + 5,
        interactionType: 'user.item_preview',
        isActive: false,
    },
];

const sortedCollaboratorList = [
    // ignore interactedAt and interactionType when use is active
    {
        interactedAt: 0,
        interactionType: 'user.item_upload',
        isActive: true,
    },
    // All other activies remain the same order as passed in
    {
        interactedAt: 2,
        interactionType: 'user.item_preview',
        isActive: false,
    },
    {
        interactedAt: 86400000,
        interactionType: 'user.item_preview',
        isActive: false,
    },
    {
        interactedAt: 86400002,
        interactionType: 'user.item_upload',
        isActive: false,
    },
    {
        interactedAt: 86400005,
        interactionType: 'user.item_preview',
        isActive: false,
    },
];

describe('features/presence/utils/sortByActivity', () => {
    describe('sortByActivity()', () => {
        test('should sort active users ahead of inactive users', () => {
            const list = [
                {
                    lastAccessTimeMS: 999,
                    isActive: false,
                },
                {
                    lastAccessTimeMS: 0,
                    isActive: true,
                },
            ];

            expect(list.sort(sortByActivity)).toEqual(list.reverse());
        });

        test('should sort lastModifiedTimeMS from high to low when both users have a lastModifiedTimeMS within MS_IN_A_DAY of their lastAccessTimeMS', () => {
            const list = [
                {
                    lastAccessTimeMS: 1,
                    lastModifiedTimeMS: 2,
                    isActive: false,
                },
                {
                    lastAccessTimeMS: 0,
                    lastModifiedTimeMS: 3,
                    isActive: false,
                },
            ];

            expect(list.sort(sortByActivity)).toEqual(list.reverse());
        });

        test('should sort a list of collaborators correctly', () => {
            expect(collaboratorList.sort(sortByActivity)).toEqual(sortedCollaboratorList);
        });
    });

    describe('getLastActionTimeMS()', () => {
        test("should return lastAccessTimeMS if lastModifiedTimeMS doesn't exist", () => {
            expect(getLastActionTimeMS(1, null)).toEqual(1);
        });

        test('should return lastModifiedTimeMS if it and lastAccessTimeMS are within MS_IN_A_DAY', () => {
            expect(getLastActionTimeMS(86400000, 1)).toEqual(1);
        });

        test('should return lastAccessTimeMS if it and lastModifiedTimeMS are not within MS_IN_A_DAY', () => {
            expect(getLastActionTimeMS(86400002, 1)).toEqual(86400002);
        });
    });

    describe('determineInteractionMessage()', () => {
        [
            // Preview
            {
                interactionType: 'user.item_preview',
                interactedAt: Date.now() + 10,
                message: messages.previewedIntheLastMinuteText,
            },
            // Edit
            {
                interactionType: 'user.item_upload',
                interactedAt: MS_IN_A_DAY,
                message: messages.timeSinceLastModifiedText,
            },
            // Comment
            {
                interactionType: 'user.comment_create',
                interactedAt: MS_IN_A_DAY + 2,
                message: messages.timeSinceLastCommentedText,
            },
            // Box notes for the following two test cases
            // Open
            {
                interactionType: 'user.item_open',
                interactedAt: 0,
                message: messages.timeSinceLastAccessedText,
            },
            // Modify
            {
                interactionType: 'user.item_modify',
                interactedAt: 0,
                message: messages.timeSinceLastModifiedText,
            },
        ].forEach(({ interactionType, interactedAt, message }) => {
            test(`should return correct message for ${interactionType} interaction type`, () => {
                expect(determineInteractionMessage(interactionType, interactedAt)).toEqual(message);
            });
        });
    });
});
