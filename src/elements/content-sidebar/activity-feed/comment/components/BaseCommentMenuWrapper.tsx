import * as React from 'react';
import type { BoxCommentPermission, FeedItemStatus } from '../../../../../common/types/feed';

import { BaseCommentMenu } from './BaseCommentMenu';
import type { OnAnnotationStatusChange, OnCommentStatusChange } from '../types';

export interface BaseCommentMenuWrapperProps {
    canDelete: boolean;
    canEdit: boolean;
    canResolve: boolean;
    id: string;
    isEditing: boolean;
    isInputOpen: boolean;
    isResolved: boolean;
    onDelete: (args: { id: string; permissions?: BoxCommentPermission }) => void;
    onSelect: (isSelected: boolean) => void;
    onStatusChange?: OnAnnotationStatusChange | OnCommentStatusChange;
    permissions: BoxCommentPermission;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    setIsInputOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

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
    setIsInputOpen,
}: BaseCommentMenuWrapperProps): JSX.Element => {
    const [isConfirmingDelete, setIsConfirmingDelete] = React.useState<boolean>(false);

    const handleDeleteConfirm = (): void => {
        onDelete({ id, permissions });
        onSelect(false);
    };

    const handleDeleteCancel = (): void => {
        setIsConfirmingDelete(false);
        onSelect(false);
    };

    const handleDeleteClick = (): void => {
        setIsConfirmingDelete(true);
        onSelect(true);
    };

    const handleEditClick = (): void => {
        setIsEditing(true);
        setIsInputOpen(true);
        onSelect(true);
    };

    const handleMenuClose = (): void => {
        if (isConfirmingDelete || isEditing || isInputOpen) {
            return;
        }
        onSelect(false);
    };

    const handleStatusUpdate = (selectedStatus: FeedItemStatus): void => {
        if (onStatusChange) {
            onStatusChange({ id, status: selectedStatus, permissions });
        }
    };

    return (
        <BaseCommentMenu
            canDelete={canDelete}
            canEdit={canEdit}
            canResolve={canResolve}
            handleDeleteCancel={handleDeleteCancel}
            handleDeleteClick={handleDeleteClick}
            handleDeleteConfirm={handleDeleteConfirm}
            handleEditClick={handleEditClick}
            handleMenuClose={handleMenuClose}
            handleStatusUpdate={handleStatusUpdate}
            isConfirmingDelete={isConfirmingDelete}
            isResolved={isResolved}
            onSelect={onSelect}
        />
    );
};
