const ITEM_LIST_COLUMNS = [{
  allowsSorting: true,
  id: 'name',
  isRowHeader: true,
  messageId: 'nameColumn'
}, {
  allowsSorting: true,
  id: 'date',
  messageId: 'dateColumn'
}, {
  allowsSorting: true,
  id: 'size',
  messageId: 'sizeColumn',
  width: 120
}, {
  hideHeader: true,
  id: 'actions',
  messageId: 'actionsColumn',
  width: 100
}];
const MEDIUM_ITEM_LIST_COLUMNS = [{
  allowsSorting: true,
  id: 'name',
  isRowHeader: true,
  messageId: 'nameColumn'
}, {
  allowsSorting: true,
  id: 'date',
  messageId: 'dateColumn'
}, {
  hideHeader: true,
  id: 'actions',
  messageId: 'actionsColumn',
  width: 100
}];
const SMALL_ITEM_LIST_COLUMNS = [{
  id: 'details',
  isRowHeader: true,
  messageId: 'detailsColumn'
}, {
  hideHeader: true,
  id: 'actions',
  maxWidth: 10,
  messageId: 'actionsColumn',
  minWidth: 10
}];
const ITEM_ICON_SIZE = 36;
export { ITEM_ICON_SIZE, ITEM_LIST_COLUMNS, MEDIUM_ITEM_LIST_COLUMNS, SMALL_ITEM_LIST_COLUMNS };
//# sourceMappingURL=constants.js.map