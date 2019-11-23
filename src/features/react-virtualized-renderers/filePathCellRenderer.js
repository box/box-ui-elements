// @flow
import * as React from 'react';
import classNames from 'classnames';

import { FormattedMessage } from 'react-intl';
import { TYPE_FOLDER, DEFAULT_ROOT } from '../../constants';
import commonMessages from '../../common/messages';
import Breadcrumb from '../../components/breadcrumb';
import FolderIcon from '../../icons/folder-icon';
import FileIcon from '../../icons/file-icon';
import getSize from '../../utils/size';
import { getFileExtension } from '../../utils/file';

import baseCellRenderer from './baseCellRenderer';

import type { FilePathCellRendererCellData, FilePathCellRendererParams, FileItemPath } from './flowTypes';

import './FilePathCell.scss';

const getName = ({ name, type, isExternal, id }: FileItemPath = {}) => {
    if (id === DEFAULT_ROOT) {
        return <FormattedMessage {...commonMessages.allFiles} />;
    }

    if (isExternal) {
        const message = type === TYPE_FOLDER ? commonMessages.externalFolder : commonMessages.externalFile;
        return <FormattedMessage {...message} />;
    }

    return name || id;
};

const fileNameCellRenderer = (cellRendererParams: FilePathCellRendererParams) =>
    baseCellRenderer(cellRendererParams, (cellValue: FilePathCellRendererCellData) => {
        const { id, name = '', size, itemPath = [], itemType, isExternal } = cellValue;
        const extension = getFileExtension(name);
        const icon = itemType === TYPE_FOLDER ? <FolderIcon /> : <FileIcon extension={extension} />;
        const path = itemPath.map(pathInfo => getName(pathInfo));
        const displaySize = size ? ` (${getSize(size)})` : '';
        const contentName = getName({ id, isExternal, type: itemType, name });
        const displayName = (
            <>
                {contentName}
                {displaySize}
            </>
        );
        const fullPath = [...path, displayName];
        const filePathCellClass = classNames('FilePathCell', { 'is-external': isExternal });

        return (
            <span className={filePathCellClass}>
                {icon}
                <Breadcrumb label="contentPath">
                    {fullPath.map((item, index) => (
                        <span key={index} className="FilePathCell-breadcrumbName">
                            {item}
                        </span>
                    ))}
                </Breadcrumb>
            </span>
        );
    });

export default fileNameCellRenderer;
