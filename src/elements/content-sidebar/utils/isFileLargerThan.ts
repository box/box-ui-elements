import { type BoxItem } from '../../../common/types/core';

export function isFileLargerThan(file: BoxItem | null, breakpoint: number): boolean {
    return file ? file.size > breakpoint : false;
}
