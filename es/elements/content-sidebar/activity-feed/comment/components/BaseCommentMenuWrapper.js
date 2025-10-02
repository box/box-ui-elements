import * as React from 'react';
import { BaseCommentMenu } from './BaseCommentMenu';
export const BaseCommentMenuWrapper = ({
  canDelete,
  canEdit,
  canResolve,
  id,
  isEditing,
  isInputOpen,
  isResolved,
  onDelete,
  onSelect,
  onStatusChange,
  permissions,
  setIsEditing,
  setIsInputOpen
}) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false);
  const handleDeleteConfirm = () => {
    onDelete({
      id,
      permissions
    });
    onSelect(false);
  };
  const handleDeleteCancel = () => {
    setIsConfirmingDelete(false);
    onSelect(false);
  };
  const handleDeleteClick = () => {
    setIsConfirmingDelete(true);
    onSelect(true);
  };
  const handleEditClick = () => {
    setIsEditing(true);
    setIsInputOpen(true);
    onSelect(true);
  };
  const handleMenuClose = () => {
    if (isConfirmingDelete || isEditing || isInputOpen) {
      return;
    }
    onSelect(false);
  };
  const handleStatusUpdate = selectedStatus => {
    if (onStatusChange) {
      onStatusChange({
        id,
        status: selectedStatus,
        permissions
      });
    }
  };
  return /*#__PURE__*/React.createElement(BaseCommentMenu, {
    canDelete: canDelete,
    canEdit: canEdit,
    canResolve: canResolve,
    handleDeleteCancel: handleDeleteCancel,
    handleDeleteClick: handleDeleteClick,
    handleDeleteConfirm: handleDeleteConfirm,
    handleEditClick: handleEditClick,
    handleMenuClose: handleMenuClose,
    handleStatusUpdate: handleStatusUpdate,
    isConfirmingDelete: isConfirmingDelete,
    isResolved: isResolved,
    onSelect: onSelect
  });
};
//# sourceMappingURL=BaseCommentMenuWrapper.js.map