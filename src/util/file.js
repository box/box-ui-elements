/**
 * @flow
 * @file Helper for throwing errors
 * @author Box
 */

import { FILE_EXTENSION_BOX_NOTE } from '../constants';
import type { BoxItem } from '../flowTypes';

/* eslint-disable import/prefer-default-export */
export function isBoxNote(file: BoxItem): boolean {
    return file.extension === FILE_EXTENSION_BOX_NOTE;
}
