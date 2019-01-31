/**
 * @flow
 * @file Component for file icon and name
 */

import React from 'react';
import FileIcon from 'icons/file-icon/FileIcon';
import IconFolderPersonal from 'icons/folder/IconFolderPersonal';
import ItemName from './ItemName';
import './IconName.scss';

type Props = {
    name: string,
    extension: string,
    isFolder?: boolean,
};

const IconName = ({ name, extension, isFolder = false }: Props) => (
    <div className="bcu-item-icon-name">
        <div className="bcu-item-icon">{isFolder ? <IconFolderPersonal /> : <FileIcon extension={extension} />}</div>
        <div className="bcu-item-name">
            <ItemName name={name} />
        </div>
    </div>
);

export default IconName;
