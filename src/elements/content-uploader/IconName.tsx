import * as React from 'react';
import { useIntl } from 'react-intl';
import { FolderPersonal } from '@box/blueprint-web-assets/icons/Content';
import { Size8 } from '@box/blueprint-web-assets/tokens/tokens';
import Badgeable from '../../components/badgeable';
import FileIcon from '../../icons/file-icon/FileIcon';
import IconAlertDefault from '../../icons/general/IconAlertDefault';
import ItemName from './ItemName';
import { STATUS_ERROR } from '../../constants';
import messages from '../common/messages';
import type { UploadStatus } from '../../common/types/upload';
import './IconName.scss';

export interface IconNameProps {
    extension: string;
    isFolder?: boolean;
    isResumableUploadsEnabled: boolean;
    name: string;
    status: UploadStatus;
}

const IconName = ({ name, extension, isFolder = false, isResumableUploadsEnabled, status }: IconNameProps) => {
    const { formatMessage } = useIntl();

    let icon = isFolder ? (
        <FolderPersonal height={Size8} aria-label={formatMessage(messages.folder)} width={Size8} />
    ) : (
        <FileIcon extension={extension} />
    );

    if (isResumableUploadsEnabled && status === STATUS_ERROR) {
        icon = (
            <Badgeable
                className="bcu-icon-badge"
                bottomRight={<IconAlertDefault height={18} title={formatMessage(messages.error)} width={18} />}
            >
                {icon}
            </Badgeable>
        );
    }

    return (
        <div className="bcu-item-icon-name">
            <div className="bcu-item-icon" data-testid="bcu-IconName-icon">
                {icon}
            </div>
            <div className="bcu-item-name">
                <ItemName name={name} />
            </div>
        </div>
    );
};

export default IconName;
