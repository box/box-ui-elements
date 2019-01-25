// @flow
import { ITEM_TYPE_FOLDER, ITEM_TYPE_FILE, ITEM_TYPE_WEBLINK } from './constants';

export type inlineNoticeType = 'warning' | 'error' | 'success' | 'info';
export type itemType = ITEM_TYPE_FOLDER | ITEM_TYPE_FILE | ITEM_TYPE_WEBLINK;
