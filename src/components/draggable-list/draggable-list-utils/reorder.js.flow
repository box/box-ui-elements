// @flow

function reorder(list: Array<any>, startIndex: number, endIndex: number): Array<any> {
    const result = list.slice(0);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
}

export default reorder;
