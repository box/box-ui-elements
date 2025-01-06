import { ITEM_TYPE_FOLDER, ITEM_TYPE_FILE, ITEM_TYPE_HUBS, ITEM_TYPE_WEBLINK } from '../constants';

export type StringMap = { [key: string]: string };
export type StringAnyMap = { [key: string]: unknown };
export type StringMixedMap = { [key: string]: unknown };
export type StringBooleanMap = { [key: string]: boolean };
export type NumberBooleanMap = { [key: number]: boolean };

export type ItemType =
    | typeof ITEM_TYPE_FOLDER
    | typeof ITEM_TYPE_FILE
    | typeof ITEM_TYPE_HUBS
    | typeof ITEM_TYPE_WEBLINK;
