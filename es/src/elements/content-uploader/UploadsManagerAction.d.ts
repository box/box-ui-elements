import * as React from 'react';
import type { UploadStatus } from '../../common/types/upload';
import './UploadsManagerAction.scss';
export interface UploadsManagerActionProps {
    hasMultipleFailedUploads: boolean;
    onClick: (status: UploadStatus) => void;
}
declare const UploadsManagerAction: ({ hasMultipleFailedUploads, onClick }: UploadsManagerActionProps) => React.JSX.Element;
export default UploadsManagerAction;
