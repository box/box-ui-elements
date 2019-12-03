// @flow
import * as React from 'react';
import classNames from 'classnames';
import type { IntlShape } from 'react-intl';
import { getFileExtension } from '../../utils/file';
import messages from './messages';
import FileIcon from '../../icons/file-icon';
import FolderIcon from '../../icons/folder-icon';
import Link from '../../components/link/Link';
import baseCellRenderer from './baseCellRenderer';
import type { FileNameCellRendererCellData, FileNameCellRendererParams } from './flowTypes';
import './FileNameCell.scss';

const fileNameCellRenderer = (intl: IntlShape) => (cellRendererParams: FileNameCellRendererParams) =>
    baseCellRenderer(cellRendererParams, (cellValue: FileNameCellRendererCellData) => {
        const { id, name, isExternal, type } = cellValue;
        const extension = getFileExtension(name);
        const displayName = isExternal ? intl.formatMessage(messages.externalFile) : name;
        const fileNameCellClass = classNames('bdl-FileNameCell-link', {
            'is-external': isExternal,
        });

        return (
            <span className="bdl-FileNameCell" title={displayName}>
                {type === 'folder' ? (
                    <FolderIcon dimension={32} isExternal={isExternal} />
                ) : (
                    <FileIcon dimension={32} extension={extension} />
                )}
                {id ? (
                    <Link className={fileNameCellClass} href={`/file/${id}`} rel="noopener noreferrer" target="_blank">
                        {displayName}
                    </Link>
                ) : (
                    <span className={fileNameCellClass}>{displayName}</span>
                )}
            </span>
        );
    });

export default fileNameCellRenderer;
