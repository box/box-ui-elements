import isRowSelectable from '../cellRendererHelper';
import { BoxItem } from '../../../common/types/core';
import { TYPE_FILE, TYPE_FOLDER } from '../../../constants';

describe('elements/content-picker/cellRendererHelper', () => {
    const createItem = (type: string, extension = '', selected = false): BoxItem => ({
        id: '123',
        name: 'test',
        type,
        extension,
        selected,
    });

    describe('isRowSelectable()', () => {
        test('should return true when folder picker and type is folder', () => {
            expect(isRowSelectable(TYPE_FOLDER, [], false, createItem(TYPE_FOLDER))).toBeTruthy();
        });

        test('should return false when folder picker and type is file', () => {
            expect(isRowSelectable(TYPE_FOLDER, [], false, createItem(TYPE_FILE, 'doc'))).toBeFalsy();
        });

        test('should return true when file picker and type is file with no whitelist extensions', () => {
            expect(isRowSelectable(TYPE_FILE, [], false, createItem(TYPE_FILE, 'doc'))).toBeTruthy();
        });

        test('should return false when file picker and type is folder', () => {
            expect(isRowSelectable(TYPE_FILE, [], false, createItem(TYPE_FOLDER))).toBeFalsy();
        });

        test('should return true when file picker and type is file and extension is whitelisted', () => {
            expect(isRowSelectable(TYPE_FILE, ['doc'], false, createItem(TYPE_FILE, 'doc'))).toBeTruthy();
        });

        test('should return false when file picker and type is file and extension is not whitelisted', () => {
            expect(isRowSelectable(TYPE_FILE, ['ppt'], false, createItem(TYPE_FILE, 'doc'))).toBeFalsy();
        });

        test('should return false when selection limit has reached and item is not selected', () => {
            expect(isRowSelectable(TYPE_FILE, [], true, createItem(TYPE_FILE))).toBeFalsy();
        });

        test('should return true when selection limit has reached and item is selected', () => {
            expect(isRowSelectable(TYPE_FILE, [], true, createItem(TYPE_FILE, '', true))).toBeTruthy();
        });
    });
});
