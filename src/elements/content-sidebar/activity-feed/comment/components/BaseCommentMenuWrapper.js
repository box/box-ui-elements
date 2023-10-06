// @flow
import React from 'react';
import type { BoxCommentPermission, FeedItemStatus } from '../../../../../common/types/feed';

import { BaseCommentMenu } from './BaseCommentMenu';
import type { OnAnnotationStatusChange, OnCommentStatusChange } from '../types';

export interface BaseCommentMenuWrapperProps {
    canDelete: boolean;
    canEdit: boolean;
    canResolve: boolean;
    id: string;
    isResolved: boolean;
    onDelete: ({ id: string, permissions?: BoxCommentPermission }) => any;
    onSelect: (isSelected: boolean) => void;
    onStatusChange?: OnAnnotationStatusChange | OnCommentStatusChange | typeof undefined;
    permissions: BoxCommentPermission;
    setEditingCommentsIds: (editingCommentsIds: string[] | ((prevState: string[]) => string[])) => void;
    setIsEditing: ((boolean => boolean) | boolean) => void;
    setIsInputOpen: ((boolean => boolean) | boolean) => void;
}

export const BaseCommentMenuWrapper = ({
    canDelete,
    canEdit,
    canResolve,
    id,
    isResolved,
    onDelete,
    onSelect,
    onStatusChange,
    permissions,
    setIsEditing,
    setEditingCommentsIds,
    setIsInputOpen,
}: BaseCommentMenuWrapperProps) => {
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
        setEditingCommentsIds((prevState: string[]) => [...prevState, id]);
        setIsEditing(true);
        setIsInputOpen(true);
        onSelect(true);
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
            handleStatusUpdate={handleStatusUpdate}
            isConfirmingDelete={isConfirmingDelete}
            isResolved={isResolved}
            onSelect={onSelect}
        />
    );
};
