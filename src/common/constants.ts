const ITEM_TYPE_FILE = 'file' as const;
const ITEM_TYPE_FOLDER = 'folder' as const;
const ITEM_TYPE_HUBS = 'hubs' as const;
const ITEM_TYPE_WEBLINK = 'web_link' as const;

const JSON_PATCH_OP_ADD = 'add' as const;
const JSON_PATCH_OP_REMOVE = 'remove' as const;
const JSON_PATCH_OP_REPLACE = 'replace' as const;
const JSON_PATCH_OP_TEST = 'test' as const;

const METADATA_FIELD_TYPE_ENUM = 'enum' as const;
const METADATA_FIELD_TYPE_MULTISELECT = 'multiSelect' as const;

export {
    ITEM_TYPE_FILE,
    ITEM_TYPE_FOLDER,
    ITEM_TYPE_HUBS,
    ITEM_TYPE_WEBLINK,
    JSON_PATCH_OP_ADD,
    JSON_PATCH_OP_REMOVE,
    JSON_PATCH_OP_REPLACE,
    JSON_PATCH_OP_TEST,
    METADATA_FIELD_TYPE_ENUM,
    METADATA_FIELD_TYPE_MULTISELECT,
};
