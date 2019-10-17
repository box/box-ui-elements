// Note that, since convertToBoxItem is thoroughly typed, we should only add tests
// for type conversions, and not the full structure of the object.
import convertToBoxItem from '../item';

describe('features/unified-share-modal/utils/item', () => {
    test('should correctly format any key/value pairs that change type between payloads', () => {
        const input = {
            id: 1234567,
        };
        const expected = {
            allowed_shared_link_access_levels: undefined,
            content_created_at: undefined,
            content_modified_at: undefined,
            created_at: undefined,
            created_by: undefined,
            description: undefined,
            download_url: undefined,
            extension: undefined,
            file_version: undefined,
            has_collaborations: undefined,
            id: '1234567',
            interacted_at: undefined,
            is_download_available: undefined,
            is_externally_owned: undefined,
            item_collection: undefined,
            metadata: undefined,
            modified_at: undefined,
            modified_by: undefined,
            name: undefined,
            owned_by: undefined,
            parent: undefined,
            path_collection: undefined,
            permissions: undefined,
            restored_from: undefined,
            selected: undefined,
            shared_link: undefined,
            size: undefined,
            type: undefined,
            url: undefined,
            version_number: undefined,
        };

        expect(convertToBoxItem(input)).toStrictEqual(expected);
    });
});
