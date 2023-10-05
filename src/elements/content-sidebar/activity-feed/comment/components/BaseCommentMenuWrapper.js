// @flow
import React from 'react';
import type { BoxCommentPermission, FeedItemStatus } from '../../../../../common/types/feed';
import type { OnAnnotationEdit, OnCommentEdit } from '../types';

import { BaseCommentMenu } from './BaseCommentMenu';

export interface BaseCommentMenuWrapperProps {
    canDelete: boolean;
    canEdit: boolean;
    canResolve: boolean;
    id: string;
    isResolved: boolean;
    onAnnotationEdit?: OnAnnotationEdit | typeof undefined;
    onCommentEdit: OnCommentEdit;
    onDelete: ({ id: string, permissions?: BoxCommentPermission }) => any;
    onSelect: (isSelected: boolean) => void;
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
    onAnnotationEdit,
    onCommentEdit,
    onDelete,
    onSelect,
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
        if (onAnnotationEdit) {
            onAnnotationEdit({ id, permissions });
        } else if (onCommentEdit) {
            onCommentEdit({ id, status: selectedStatus, hasMention: false, permissions });
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
