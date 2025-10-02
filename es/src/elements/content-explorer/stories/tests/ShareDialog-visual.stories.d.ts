import * as React from 'react';
import { ShareDialogProps } from '../../ShareDialog';
import '../../../common/modal.scss';
export declare const shareDialogNotLoading: {
    render: (args: ShareDialogProps) => React.JSX.Element;
};
export declare const shareDialogIsLoading: {
    render: (args: ShareDialogProps) => React.JSX.Element;
};
export declare const shareDialogShareAccessSelect: {
    render: (args: ShareDialogProps) => React.JSX.Element;
};
declare const _default: {
    title: string;
    component: ({ appElement, canSetShareAccess, isLoading, isOpen, item, onCancel, onShareAccessChange, parentElement, }: ShareDialogProps) => React.JSX.Element;
};
export default _default;
