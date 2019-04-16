/**
 * @flow
 * @file file info section of the preview header
 * @author Box
 */

import React from 'react';
import FileIcon from '../../../icons/file-icon/FileIcon';
import './Header.scss';

type Props = {
    item: ?BoxItem | ?BoxItemVersion,
};

const FileInfo = ({ item }: Props) => (
    <div className="bcpr-name">
        {item && (
            <React.Fragment>
                <FileIcon dimension={24} extension={item.extension} />
                <span> {item.name} </span>
            </React.Fragment>
        )}
    </div>
);

export default FileInfo;
