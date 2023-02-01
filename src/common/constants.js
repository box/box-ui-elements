// @flow
import { TYPE_FILE, TYPE_FOLDER, TYPE_WEBLINK } from '../constants';

const ITEM_TYPE_FILE = TYPE_FILE;
const ITEM_TYPE_FOLDER = TYPE_FOLDER;
const ITEM_TYPE_WEBLINK = TYPE_WEBLINK;

const JSON_PATCH_OP_ADD: 'add' = 'add';
const JSON_PATCH_OP_REMOVE: 'remove' = 'remove';
const JSON_PATCH_OP_REPLACE: 'replace' = 'replace';
const JSON_PATCH_OP_TEST: 'test' = 'test';

const METADATA_FIELD_TYPE_ENUM: 'enum' = 'enum';
const METADATA_FIELD_TYPE_MULTISELECT: 'multiSelect' = 'multiSelect';

export {
    ITEM_TYPE_FILE,
    ITEM_TYPE_FOLDER,
    ITEM_TYPE_WEBLINK,
    JSON_PATCH_OP_ADD,
    JSON_PATCH_OP_REMOVE,
    JSON_PATCH_OP_REPLACE,
    JSON_PATCH_OP_TEST,
    METADATA_FIELD_TYPE_ENUM,
    METADATA_FIELD_TYPE_MULTISELECT,
};
