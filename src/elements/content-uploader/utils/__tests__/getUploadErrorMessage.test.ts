import Browser from '../../../../utils/Browser';
import {
    ERROR_CODE_ITEM_NAME_IN_USE,
    ERROR_CODE_ITEM_NAME_INVALID,
    ERROR_CODE_UPLOAD_BAD_DIGEST,
    ERROR_CODE_UPLOAD_CHILD_FOLDER_FAILED,
    ERROR_CODE_UPLOAD_FAILED_PACKAGE,
    ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED,
    ERROR_CODE_UPLOAD_INSUFFICIENT_PERMISSIONS,
    ERROR_CODE_UPLOAD_PENDING_APP_FOLDER_SIZE_LIMIT,
    ERROR_CODE_UPLOAD_STORAGE_LIMIT_EXCEEDED,
} from '../../../../constants';
import { defaultUploadErrorMessage, getUploadErrorMessage, resolveUploadErrorCode } from '../getUploadErrorMessage';

describe('elements/content-uploader/utils/getUploadErrorMessage', () => {
    describe('resolveUploadErrorCode()', () => {
        test.each([
            ['file.zip', true, ERROR_CODE_UPLOAD_FAILED_PACKAGE],
            ['file.txt', true, ERROR_CODE_UPLOAD_BAD_DIGEST],
            ['file.zip', false, ERROR_CODE_UPLOAD_BAD_DIGEST],
        ])('maps a bad digest on %s in Safari=%s to %s', (fileName, isSafari, expected) => {
            jest.spyOn(Browser, 'isSafari').mockReturnValue(isSafari);

            expect(resolveUploadErrorCode(ERROR_CODE_UPLOAD_BAD_DIGEST, fileName)).toBe(expected);
        });

        test('does not rewrite a bad digest when the file name is unknown', () => {
            jest.spyOn(Browser, 'isSafari').mockReturnValue(true);

            expect(resolveUploadErrorCode(ERROR_CODE_UPLOAD_BAD_DIGEST)).toBe(ERROR_CODE_UPLOAD_BAD_DIGEST);
        });

        test('normalizes a missing code to null', () => {
            expect(resolveUploadErrorCode()).toBeNull();
        });
    });

    describe('getUploadErrorMessage()', () => {
        test.each([
            [
                ERROR_CODE_UPLOAD_CHILD_FOLDER_FAILED,
                'be.uploadsOneOrMoreChildFoldersFailedToUploadMessage',
                'One or more child folders failed to upload.',
            ],
            [
                ERROR_CODE_ITEM_NAME_IN_USE,
                'be.uploadsItemNameInUseErrorMessage',
                'A file with this name already exists.',
            ],
            [
                ERROR_CODE_UPLOAD_STORAGE_LIMIT_EXCEEDED,
                'be.uploadsStorageLimitErrorMessage',
                'Account storage limit reached',
            ],
            [
                ERROR_CODE_UPLOAD_INSUFFICIENT_PERMISSIONS,
                'be.uploadsInsufficientPermissionsErrorMessage',
                "You don't have permission to upload to this folder",
            ],
            [
                ERROR_CODE_UPLOAD_PENDING_APP_FOLDER_SIZE_LIMIT,
                'be.uploadsPendingFolderSizeLimitErrorMessage',
                'Pending app folder size limit exceeded',
            ],
            [
                ERROR_CODE_UPLOAD_FAILED_PACKAGE,
                'be.uploadsPackageUploadErrorMessage',
                'Failed to upload package file. Please retry by saving as a single file.',
            ],
        ])('maps %s to its descriptor', (errorCode, id, defaultMessage) => {
            expect(getUploadErrorMessage(errorCode)).toMatchObject({ descriptor: { id, defaultMessage } });
        });

        test('maps the file size limit to the plain message by default', () => {
            expect(getUploadErrorMessage(ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED)).toMatchObject({
                descriptor: {
                    id: 'be.uploadsFileSizeLimitExceededErrorMessage',
                    defaultMessage: 'File size exceeds the folder owner’s file size limit',
                },
            });
        });

        test('maps the file size limit to the upgrade CTA message when the CTA is enabled', () => {
            expect(getUploadErrorMessage(ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED, null, true)).toMatchObject({
                descriptor: {
                    id: 'be.uploadsFileSizeLimitExceededErrorMessageForUpgradeCta',
                    defaultMessage: 'This file exceeds your plan’s upload limit. Upgrade now to store larger files.',
                },
            });
        });

        test('passes the item name to the invalid folder name message', () => {
            expect(getUploadErrorMessage(ERROR_CODE_ITEM_NAME_INVALID, 'bad/name')).toMatchObject({
                descriptor: {
                    id: 'be.uploadsProvidedFolderNameInvalidMessage',
                    defaultMessage: 'Provided folder name, {name}, could not be used to create a folder.',
                },
                values: { name: 'bad/name' },
            });
        });

        test('falls back to an empty name when the item name is missing', () => {
            expect(getUploadErrorMessage(ERROR_CODE_ITEM_NAME_INVALID)).toMatchObject({
                descriptor: {
                    id: 'be.uploadsProvidedFolderNameInvalidMessage',
                    defaultMessage: 'Provided folder name, {name}, could not be used to create a folder.',
                },
                values: { name: '' },
            });
        });

        test.each([['UNKNOWN_ERROR_CODE'], [null], [undefined]])(
            'returns null for %s so callers can choose their own fallback',
            errorCode => {
                expect(getUploadErrorMessage(errorCode)).toBeNull();
            },
        );
    });

    test('exposes the generic upload failure as the shared default', () => {
        expect(defaultUploadErrorMessage).toMatchObject({
            descriptor: {
                id: 'be.uploadsDefaultErrorMessage',
                defaultMessage: 'Something went wrong with the upload. Please try again.',
            },
        });
    });
});
