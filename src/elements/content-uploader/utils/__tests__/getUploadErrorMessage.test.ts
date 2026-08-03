import Browser from '../../../../utils/Browser';
import messages from '../../../common/messages';
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
            [ERROR_CODE_UPLOAD_CHILD_FOLDER_FAILED, messages.uploadsOneOrMoreChildFoldersFailedToUploadMessage],
            [ERROR_CODE_ITEM_NAME_IN_USE, messages.uploadsItemNameInUseErrorMessage],
            [ERROR_CODE_UPLOAD_STORAGE_LIMIT_EXCEEDED, messages.uploadsStorageLimitErrorMessage],
            [ERROR_CODE_UPLOAD_INSUFFICIENT_PERMISSIONS, messages.uploadsInsufficientPermissionsErrorMessage],
            [ERROR_CODE_UPLOAD_PENDING_APP_FOLDER_SIZE_LIMIT, messages.uploadsPendingFolderSizeLimitErrorMessage],
            [ERROR_CODE_UPLOAD_FAILED_PACKAGE, messages.uploadsPackageUploadErrorMessage],
        ])('maps %s to its descriptor', (errorCode, descriptor) => {
            expect(getUploadErrorMessage(errorCode)).toEqual({ descriptor });
        });

        test('maps the file size limit to the plain message by default', () => {
            expect(getUploadErrorMessage(ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED)).toEqual({
                descriptor: messages.uploadsFileSizeLimitExceededErrorMessage,
            });
        });

        test('maps the file size limit to the upgrade CTA message when the CTA is enabled', () => {
            expect(getUploadErrorMessage(ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED, null, true)).toEqual({
                descriptor: messages.uploadsFileSizeLimitExceededErrorMessageForUpgradeCta,
            });
        });

        test('passes the item name to the invalid folder name message', () => {
            expect(getUploadErrorMessage(ERROR_CODE_ITEM_NAME_INVALID, 'bad/name')).toEqual({
                descriptor: messages.uploadsProvidedFolderNameInvalidMessage,
                values: { name: 'bad/name' },
            });
        });

        test('falls back to an empty name when the item name is missing', () => {
            expect(getUploadErrorMessage(ERROR_CODE_ITEM_NAME_INVALID)).toEqual({
                descriptor: messages.uploadsProvidedFolderNameInvalidMessage,
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
        expect(defaultUploadErrorMessage).toEqual({ descriptor: messages.uploadsDefaultErrorMessage });
    });
});
