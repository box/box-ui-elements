// @flow
import * as React from 'react';
import classNames from 'classnames';
import type { IntlShape } from 'react-intl';
import noop from 'lodash/noop';
import { getFileExtension } from '../../utils/file';
import messages from './messages';
import FileIcon from '../../icons/file-icon';
import FolderIcon from '../../icons/folder-icon';
import Link from '../../components/link/Link';
import baseCellRenderer from './baseCellRenderer';
import type { FileNameCellRendererCellData, FileNameCellRendererParams } from './flowTypes';
import './FileNameCell.scss';

type FileNameProps = {
    checkClickable?: (cellValue: FileNameCellRendererCellData) => boolean,
    onClick?: Function,
};

const fileNameCellRenderer = (intl: IntlShape, props?: FileNameProps = {}) => (
    cellRendererParams: FileNameCellRendererParams,
) =>
    baseCellRenderer(cellRendererParams, (cellValue: FileNameCellRendererCellData) => {
        const { onClick = noop, checkClickable } = props;
        const { id, name, isExternal, type } = cellValue;
        const extension = getFileExtension(name);
        const displayName = isExternal ? intl.formatMessage(messages.externalFile) : name;
        const fileNameCellClass = classNames('bdl-FileNameCell-link', {
            'is-external': isExternal,
        });
        const clickable = checkClickable ? checkClickable(cellValue) : false;

        return (
            <span className="bdl-FileNameCell" title={displayName}>
                {type === 'folder' ? (
                    <FolderIcon dimension={32} isExternal={isExternal} />
                ) : (
                    <FileIcon dimension={32} extension={extension} />
                )}
                {id || clickable ? (
                    <Link
                        className={fileNameCellClass}
                        href={id && `/file/${id}`}
                        onClick={() => onClick(cellValue)}
                        rel="noopener noreferrer"
                        target="_blank"
                        component={id ? 'a' : 'span'}
                    >
                        {displayName}
                    </Link>
                ) : (
                    <span className={fileNameCellClass}>{displayName}</span>
                )}
            </span>
        );
    });

export default fileNameCellRenderer;
