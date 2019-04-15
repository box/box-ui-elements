/**
 * @flow
 * @file file info section of the preview header
 * @author Box
 */

import React from 'react';
import FileIcon from '../../../icons/file-icon/FileIcon';
import './Header.scss';

type Props = {
    item: BoxItem | BoxItemVersion,
};

const FileInfo = ({ item }: Props) => (
    <div className="bcpr-name">
        {item ? <FileIcon dimension={24} extension={item.extension} /> : null}
        <span>{item.name}</span>
    </div>
);

export default FileInfo;
