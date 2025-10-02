import * as React from 'react';
import { RenameDialogProps } from '../../RenameDialog';
import '../../../common/modal.scss';
export declare const renameDialogNotLoading: {
    render: (args: RenameDialogProps) => React.JSX.Element;
};
export declare const renameDialogIsLoading: {
    render: (args: RenameDialogProps) => React.JSX.Element;
};
export declare const renameDialogNameInvalidError: {
    render: (args: RenameDialogProps) => React.JSX.Element;
};
export declare const renameDialogNameInUseError: {
    render: (args: RenameDialogProps) => React.JSX.Element;
};
export declare const renameDialogNameTooLongError: {
    render: (args: RenameDialogProps) => React.JSX.Element;
};
declare const _default: {
    title: string;
    component: ({ appElement, errorCode, isOpen, isLoading, item, onCancel, onRename, parentElement, }: RenameDialogProps) => React.JSX.Element;
};
export default _default;
