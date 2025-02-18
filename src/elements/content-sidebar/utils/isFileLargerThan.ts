import { type BoxItem } from '../../../common/types/core';

export function isFileLargerThan(file: BoxItem | null, breakpointSizeInBytes: number): boolean {
    return file ? file.size > breakpointSizeInBytes : false;
}
