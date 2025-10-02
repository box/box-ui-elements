import * as React from 'react';
import { AxiosError } from 'axios';
import type { UploadStatus } from '../../common/types/upload';
import './ItemAction.scss';
export interface ItemActionProps {
    error?: Partial<AxiosError>;
    isFolder?: boolean;
    isResumableUploadsEnabled: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    onUpgradeCTAClick?: () => void;
    status: UploadStatus;
}
declare const ItemAction: ({ error, isFolder, isResumableUploadsEnabled, onClick, onUpgradeCTAClick, status, }: ItemActionProps) => React.JSX.Element;
export default ItemAction;
