import isRowSelectable from '../cellRendererHelper';

describe('picker/components/cellRendererHelper/isRowSelectable()', () => {
    test('should return true when folder picker and type is folder', () => {
        expect(isRowSelectable('folder', [], false, { type: 'folder' })).toBeTruthy();
    });
    test('should return false when folder picker and type is file', () => {
        expect(
            isRowSelectable('folder', [], false, {
                type: 'file',
                extension: 'doc',
            }),
        ).toBeFalsy();
    });
    test('should return true when file picker and type is file with no whitelist extensions', () => {
        expect(
            isRowSelectable('file', [], false, {
                type: 'file',
                extension: 'doc',
            }),
        ).toBeTruthy();
    });
    test('should return false when file picker and type is folder', () => {
        expect(isRowSelectable('file', [], false, { type: 'folder' })).toBeFalsy();
    });
    test('should return true when file picker and type is file and extension is whitelisted', () => {
        expect(
            isRowSelectable('file', ['doc'], false, {
                type: 'file',
                extension: 'doc',
            }),
        ).toBeTruthy();
    });
    test('should return true when file picker and type is file and extension is not whitelisted', () => {
        expect(
            isRowSelectable('file', ['ppt'], false, {
                type: 'file',
                extension: 'doc',
            }),
        ).toBeFalsy();
    });
    test('should return false when selection limit has reached and item is not selected', () => {
        expect(isRowSelectable('file', [], true, { type: 'file' })).toBeFalsy();
    });
    test('should return false when selection limit has not reached', () => {
        expect(isRowSelectable('file', [], true, { type: 'file' })).toBeFalsy();
    });
    test('should return true when selection limit has reached and item is selected', () => {
        expect(isRowSelectable('file', [], true, { type: 'file', selected: true })).toBeTruthy();
    });
});
