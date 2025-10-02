/**
 * Take the legacy item data and reformat it to map to the keys specified in the V2
 * Item format (GET //api.box.com/2.0/files/$fileID)
 * @see https://developer.box.com/reference
 * @todo Add in missing keys as needed
 * @param {LegacyItem} item The item data received by the modal
 * @return {BoxItem}
 */
function convertToBoxItem(item) {
  return {
    allowed_shared_link_access_levels: undefined,
    content_created_at: undefined,
    content_modified_at: undefined,
    created_at: undefined,
    created_by: undefined,
    description: item.description,
    download_url: undefined,
    extension: item.extension,
    file_version: undefined,
    has_collaborations: undefined,
    id: String(item.id),
    interacted_at: undefined,
    is_download_available: undefined,
    is_externally_owned: undefined,
    item_collection: undefined,
    metadata: undefined,
    modified_at: undefined,
    modified_by: undefined,
    name: item.name,
    owned_by: undefined,
    parent: undefined,
    path_collection: undefined,
    permissions: undefined,
    restored_from: undefined,
    selected: undefined,
    shared_link: undefined,
    size: undefined,
    type: item.type,
    url: undefined,
    version_number: undefined
  };
}
export default convertToBoxItem;
//# sourceMappingURL=item.js.map