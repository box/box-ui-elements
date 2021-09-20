export interface ReorderListItem {
    id: string;
    label: string;
}

function reorder(list: Array<ReorderListItem>, startIndex: number, endIndex: number): Array<ReorderListItem> {
    const result = list.slice(0);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
}

export default reorder;
