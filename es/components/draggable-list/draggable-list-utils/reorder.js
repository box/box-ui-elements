function reorder(list, startIndex, endIndex) {
  const result = list.slice(0);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}
export default reorder;
//# sourceMappingURL=reorder.js.map