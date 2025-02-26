import React from 'react';
import FileIcon from '../../../icons/file-icon/FileIcon';
import type { BoxItem, BoxItemVersion } from '../../../common/types/core';
import './FileInfo.scss';

export interface FileInfoProps {
    file?: BoxItem;
    version?: BoxItemVersion;
}

const FileInfo = ({ file, version }: FileInfoProps) => {
    // Opt to show version over the file object since it is more specific
    const displayItem = version || file;

    return (
        <div className="bcpr-FileInfo">
            {displayItem && (
                <>
                    <FileIcon dimension={24} extension={displayItem.extension} />
                    <span className="bcpr-FileInfo-name">{displayItem.name}</span>
                </>
            )}
        </div>
    );
};

export default FileInfo;
