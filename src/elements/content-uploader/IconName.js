/**
 * @flow
 * @file Component for file icon and name
 */

import React from 'react';
import FileIcon from '../../icons/file-icon/FileIcon';
import IconFolderPersonal from '../../icons/folder/IconFolderPersonal';
import ItemName from './ItemName';
import './IconName.scss';
import IconAlertDefault from '../../icons/general/IconAlertDefault';
import Badgeable from '../../components/badgeable';
import { STATUS_ERROR } from '../../constants';

type Props = {
    extension: string,
    isFolder?: boolean,
    isResumableUploadsEnabled: boolean,
    name: string,
    status: UploadStatus,
};

const IconName = ({ name, extension, isFolder = false, isResumableUploadsEnabled, status }: Props) => {
    let icon = isFolder ? <IconFolderPersonal /> : <FileIcon extension={extension} />;

    if (isResumableUploadsEnabled && status === STATUS_ERROR) {
        icon = (
            <Badgeable className="bcu-icon-badge" bottomRight={<IconAlertDefault height={18} width={18} />}>
                {icon}
            </Badgeable>
        );
    }

    return (
        <div className="bcu-item-icon-name">
            <div className="bcu-item-icon">{icon}</div>
            <div className="bcu-item-name">
                <ItemName name={name} />
            </div>
        </div>
    );
};

export default IconName;
