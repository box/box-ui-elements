import { getFieldsAsString, isValidBoxFile } from '../fields';
import {
    FIELD_ID,
    FIELD_NAME,
    FIELD_TYPE,
    FIELD_SIZE,
    FIELD_RESTORED_FROM,
    FIELD_PARENT,
    FIELD_EXTENSION,
    FIELD_PERMISSIONS,
    FIELD_ITEM_COLLECTION,
    FIELD_PATH_COLLECTION,
    FIELD_MODIFIED_AT,
    FIELD_CREATED_AT,
    FIELD_SHARED_LINK,
    FIELD_ALLOWED_SHARED_LINK_ACCESS_LEVELS,
    FIELD_HAS_COLLABORATIONS,
    FIELD_IS_EXTERNALLY_OWNED,
    FIELD_CREATED_BY,
    FIELD_MODIFIED_BY,
    FIELD_OWNED_BY,
    FIELD_DESCRIPTION,
    FIELD_REPRESENTATIONS,
    FIELD_SHA1,
    FIELD_WATERMARK_INFO,
    FIELD_AUTHENTICATED_DOWNLOAD_URL,
    FIELD_FILE_VERSION,
    FIELD_IS_DOWNLOAD_AVAILABLE,
    FIELD_VERSION_NUMBER,
    FIELD_METADATA_SKILLS,
    FIELD_ITEM_EXPIRATION,
    FIELD_METADATA_CLASSIFICATION,
} from '../../constants';

describe('util/fields/getFieldsAsString()', () => {
    describe('getFieldsAsString()', () => {
        test('should return default set of fields', () => {
            expect(getFieldsAsString()).toBe(
                [
                    FIELD_ID,
                    FIELD_NAME,
                    FIELD_TYPE,
                    FIELD_SIZE,
                    FIELD_PARENT,
                    FIELD_EXTENSION,
                    FIELD_PERMISSIONS,
                    FIELD_PATH_COLLECTION,
                    FIELD_MODIFIED_AT,
                    FIELD_CREATED_AT,
                    FIELD_MODIFIED_BY,
                    FIELD_SHARED_LINK,
                    FIELD_ALLOWED_SHARED_LINK_ACCESS_LEVELS,
                    FIELD_HAS_COLLABORATIONS,
                    FIELD_IS_EXTERNALLY_OWNED,
                    FIELD_ITEM_COLLECTION,
                ].join(',')
            );
        });
        test('should return default set + preview fields', () => {
            expect(getFieldsAsString(true)).toBe(
                [
                    FIELD_ID,
                    FIELD_NAME,
                    FIELD_TYPE,
                    FIELD_SIZE,
                    FIELD_PARENT,
                    FIELD_EXTENSION,
                    FIELD_PERMISSIONS,
                    FIELD_PATH_COLLECTION,
                    FIELD_MODIFIED_AT,
                    FIELD_CREATED_AT,
                    FIELD_MODIFIED_BY,
                    FIELD_SHARED_LINK,
                    FIELD_ALLOWED_SHARED_LINK_ACCESS_LEVELS,
                    FIELD_HAS_COLLABORATIONS,
                    FIELD_IS_EXTERNALLY_OWNED,
                    FIELD_ITEM_COLLECTION,
                    FIELD_REPRESENTATIONS,
                    FIELD_SHA1,
                    FIELD_WATERMARK_INFO,
                    FIELD_AUTHENTICATED_DOWNLOAD_URL,
                    FIELD_FILE_VERSION,
                    FIELD_IS_DOWNLOAD_AVAILABLE,
                ].join(',')
            );
        });
        test('should return default set + preview + sidebar fields', () => {
            expect(getFieldsAsString(true, true)).toBe(
                [
                    FIELD_ID,
                    FIELD_NAME,
                    FIELD_TYPE,
                    FIELD_SIZE,
                    FIELD_PARENT,
                    FIELD_EXTENSION,
                    FIELD_PERMISSIONS,
                    FIELD_PATH_COLLECTION,
                    FIELD_MODIFIED_AT,
                    FIELD_CREATED_AT,
                    FIELD_MODIFIED_BY,
                    FIELD_SHARED_LINK,
                    FIELD_ALLOWED_SHARED_LINK_ACCESS_LEVELS,
                    FIELD_HAS_COLLABORATIONS,
                    FIELD_IS_EXTERNALLY_OWNED,
                    FIELD_ITEM_COLLECTION,
                    FIELD_CREATED_BY,
                    FIELD_OWNED_BY,
                    FIELD_DESCRIPTION,
                    FIELD_METADATA_SKILLS,
                    FIELD_ITEM_EXPIRATION,
                    FIELD_METADATA_CLASSIFICATION,
                    FIELD_VERSION_NUMBER,
                    FIELD_RESTORED_FROM,
                    FIELD_REPRESENTATIONS,
                    FIELD_SHA1,
                    FIELD_WATERMARK_INFO,
                    FIELD_AUTHENTICATED_DOWNLOAD_URL,
                    FIELD_FILE_VERSION,
                    FIELD_IS_DOWNLOAD_AVAILABLE,
                ].join(',')
            );
        });
    });
    describe('isValidBoxFile()', () => {
        test('should return false for incomplete file object', () => {
            expect(isValidBoxFile()).toBeFalsy();
        });
        test('should return true for complete file object', () => {
            expect(
                isValidBoxFile({
                    type: 'file',
                    id: '13',
                    name: 'Box',
                    size: 123,
                    parent: {},
                    extension: 'mp4',
                    permissions: {},
                    path_collection: {},
                    modified_at: '2018-02-05T11:28:21-08:00',
                    created_at: '2017-10-03T16:20:18-07:00',
                    shared_link: null,
                    allowed_shared_link_access_levels: null,
                    has_collaborations: true,
                    is_externally_owned: false,
                    created_by: {},
                    modified_by: {},
                    owned_by: {},
                    description: '',
                    metadata: null,
                    representations: {},
                    sha1: '81a2233716220ed21707d9e158b69019739d1062',
                    watermark_info: {},
                    authenticated_download_url: '',
                    file_version: {},
                    is_download_available: true,
                })
            ).toBeTruthy();
        });
    });
});
