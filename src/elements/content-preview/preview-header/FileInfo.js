/**
 * @flow
 * @file file info section of the preview header
 * @author Box
 */

import React from 'react';
import { getIcon } from '../../common/item/iconCellRenderer';
import './Header.scss';

type Props = {
    file: BoxItem,
};

const FileInfo = ({ file }: Props) => (
    <div className="bcpr-name">
        {file ? getIcon(24, file) : null}
        <span>{file.name}</span>
    </div>
);

export default FileInfo;
