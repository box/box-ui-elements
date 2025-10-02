export interface ReorderListItem {
    id: string;
    label: string;
}
declare function reorder(list: Array<ReorderListItem>, startIndex: number, endIndex: number): Array<ReorderListItem>;
export default reorder;
