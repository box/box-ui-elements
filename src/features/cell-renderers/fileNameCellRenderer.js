// @flow
import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { getFileExtension } from '../../utils/file';
import messages from './messages';
import FileIcon from '../../icons/file-icon';
import Link from '../../components/link/Link';
import baseCellRenderer from './baseCellRenderer';
import type { FileNameCellRendererCellData, FileNameCellRendererParams } from './flowTypes';
import './FileNameCell.scss';

const fileNameCellRenderer = (cellRendererParams: FileNameCellRendererParams) =>
    baseCellRenderer(cellRendererParams, (cellValue: FileNameCellRendererCellData) => {
        const { id, name, isExternal } = cellValue;
        const extension = getFileExtension(name);
        const displayName = isExternal ? <FormattedMessage {...messages.externalFile} /> : name;
        const fileNameCellClass = classNames('bdl-FileNameCell-link', {
            'is-external': isExternal,
        });

        return (
            <span className="bdl-FileNameCell" title={displayName}>
                <FileIcon dimension={32} extension={extension} />
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
