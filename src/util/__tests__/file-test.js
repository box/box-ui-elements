import { isBoxNote } from '../file';

describe('util/file', () => {
    describe('isBoxNote()', () => {
        test('should false when file is not a box note', () => {
            expect(
                isBoxNote({
                    extension: 'foo'
                })
            ).toBe(false);
        });

        test('should true when file is a box note', () => {
            expect(
                isBoxNote({
                    extension: 'boxnote'
                })
            ).toBe(true);
        });
    });
});
