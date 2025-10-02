import * as React from 'react';
import { RenameDialogProps } from '../RenameDialog';
export declare const renameDialog: {
    render: (args: RenameDialogProps) => React.JSX.Element;
};
declare const _default: {
    title: string;
    component: ({ appElement, errorCode, isOpen, isLoading, item, onCancel, onRename, parentElement, }: RenameDialogProps) => React.JSX.Element;
    args: {
        isLoading: boolean;
        isOpen: boolean;
    };
};
export default _default;
