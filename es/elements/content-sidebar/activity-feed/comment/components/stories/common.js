import { TIME_STRING_SEPT_27_2017, user1 } from '../../stories/common';
export const baseCommmentMenuDefaultProps = {
  canDelete: true,
  canEdit: true,
  canResolve: true,
  handleDeleteCancel: () => undefined,
  handleDeleteClick: () => undefined,
  handleDeleteConfirm: () => undefined,
  handleEditClick: () => undefined,
  handleMenuClose: () => undefined,
  // eslint-disable-next-line no-unused-vars
  handleStatusUpdate: args => undefined,
  isConfirmingDelete: false,
  isResolved: false,
  // eslint-disable-next-line no-unused-vars
  onSelect: args => undefined
};
export const baseCommmentInfoDefaultProps = {
  created_at: TIME_STRING_SEPT_27_2017,
  created_by: user1,
  getAvatarUrl: str => new Promise(() => str)
};
//# sourceMappingURL=common.js.map