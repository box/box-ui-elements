import * as React from 'react';
import type { BoxItem } from '../../common/types/core';
export interface RenameDialogProps {
    appElement: HTMLElement;
    errorCode: string;
    isLoading: boolean;
    isOpen: boolean;
    item: BoxItem;
    onCancel: () => void;
    onRename: (value: string, extension: string) => void;
    parentElement: HTMLElement;
}
declare const RenameDialog: ({ appElement, errorCode, isOpen, isLoading, item, onCancel, onRename, parentElement, }: RenameDialogProps) => React.JSX.Element;
export default RenameDialog;
