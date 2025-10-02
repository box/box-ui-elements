import * as React from 'react';
import type { UploadStatus } from '../../common/types/upload';
import './IconName.scss';
export interface IconNameProps {
    extension: string;
    isFolder?: boolean;
    isResumableUploadsEnabled: boolean;
    name: string;
    status: UploadStatus;
}
declare const IconName: ({ name, extension, isFolder, isResumableUploadsEnabled, status }: IconNameProps) => React.JSX.Element;
export default IconName;
