import { type BoxItem } from '../../../common/types/core';

export function isFileLargerThan(file: BoxItem, breakpoint: number): boolean {
    return file ? file.size > breakpoint : false;
}
