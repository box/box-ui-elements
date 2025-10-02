import * as React from 'react';
import type { Access, BoxItem } from '../../common/types/core';
import './ShareDialog.scss';
export interface ShareDialogProps {
    appElement: HTMLElement;
    canSetShareAccess: boolean;
    isLoading: boolean;
    isOpen: boolean;
    item: BoxItem;
    onCancel: () => void;
    onShareAccessChange: (access: Access) => void;
    parentElement: HTMLElement;
}
declare const ShareDialog: ({ appElement, canSetShareAccess, isLoading, isOpen, item, onCancel, onShareAccessChange, parentElement, }: ShareDialogProps) => React.JSX.Element;
export default ShareDialog;
