import * as React from 'react';
import type { BoxItem } from '../../common/types/core';
export interface DeleteConfirmationDialogProps {
    appElement: HTMLElement;
    isLoading: boolean;
    isOpen: boolean;
    item: BoxItem;
    onCancel: () => void;
    onDelete: () => void;
    parentElement: HTMLElement;
}
declare const DeleteConfirmationDialog: ({ appElement, isLoading, isOpen, item, onCancel, onDelete, parentElement, }: DeleteConfirmationDialogProps) => React.JSX.Element;
export default DeleteConfirmationDialog;
