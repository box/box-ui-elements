/**
 * @flow
 * @file Functions to determine whether a given item is selected.
 * @author Box
 */

export function containsItem(item: BoxItem) {
    const { id, type } = item;

    return (selected: BoxItem) => selected.id === id && selected.type === type;
}

export function isSelected(item: BoxItem, selectedItems: Array<BoxItem>) {
    return !!selectedItems.find(containsItem(item));
}
