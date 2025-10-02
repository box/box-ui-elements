import * as React from 'react';
import type { FeedItemStatus } from '../../../../../common/types/feed';
import './BaseCommentMenu.scss';
export interface BaseCommentMenuProps {
    canDelete: boolean;
    canEdit: boolean;
    canResolve: boolean;
    handleDeleteCancel: () => void;
    handleDeleteClick: () => void;
    handleDeleteConfirm: () => void;
    handleEditClick: () => void;
    handleMenuClose: () => void;
    handleStatusUpdate: (selectedStatus: FeedItemStatus) => void;
    isConfirmingDelete: boolean;
    isResolved: boolean;
    onSelect: (isSelected: boolean) => void;
}
export declare const BaseCommentMenu: ({ canDelete, canEdit, canResolve, handleDeleteCancel, handleDeleteClick, handleDeleteConfirm, handleEditClick, handleMenuClose, handleStatusUpdate, isConfirmingDelete, isResolved, onSelect, }: BaseCommentMenuProps) => React.JSX.Element;
