import Comments from '../Comments';
import { getCommentsFields } from '../../util/fields';

let comments;

describe('api/Comments', () => {
    beforeEach(() => {
        comments = new Comments({});
    });

    describe('getUrl()', () => {
        test('should throw when version api url without id', () => {
            expect(() => {
                comments.getUrl();
            }).toThrow();
        });
        test('should return correct version api url with id', () => {
            expect(comments.getUrl('foo')).toBe(
                `https://api.box.com/2.0/files/foo/comments?fields=${getCommentsFields()}`
            );
        });
    });
});
