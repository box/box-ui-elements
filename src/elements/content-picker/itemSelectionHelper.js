/**
 * @flow
 * @file Functions to determine whether a given item is selected.
 * @author Box
 */

function containsItem(item: BoxItem): (selected: BoxItem) => boolean {
    const { id, type } = item;

    return (selected: BoxItem) => selected.id === id && selected.type === type;
}

function isSelected(item: BoxItem, selectedItems: Array<BoxItem>): boolean {
    return !!selectedItems.find(containsItem(item));
}

export { containsItem, isSelected };
