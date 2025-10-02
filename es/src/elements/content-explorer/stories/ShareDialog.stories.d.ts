import * as React from 'react';
import { ShareDialogProps } from '../ShareDialog';
import '../../common/modal.scss';
export declare const shareDialog: {
    render: (args: ShareDialogProps) => React.JSX.Element;
};
declare const _default: {
    title: string;
    component: ({ appElement, canSetShareAccess, isLoading, isOpen, item, onCancel, onShareAccessChange, parentElement, }: ShareDialogProps) => React.JSX.Element;
    args: {
        canSetShareAccess: boolean;
        isLoading: boolean;
        isOpen: boolean;
        item: {
            allowed_shared_link_access_levels: any[];
            id: string;
            permissions: {
                can_set_share_access: boolean;
            };
            shared_link: {
                access: any;
                url: string;
            };
        };
    };
};
export default _default;
