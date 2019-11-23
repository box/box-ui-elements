// @flow
import * as React from 'react';
import classNames from 'classnames';

import { FormattedMessage } from 'react-intl';
import { getFileExtension } from '../../utils/file';
import commonMessages from '../../common/messages';
import FileIcon from '../../icons/file-icon';
import Link from '../../components/link/Link';

import baseCellRenderer from './baseCellRenderer';

import type { FileNameCellRendererCellData, FileNameCellRendererParams } from './flowTypes';

import './FileNameCell.scss';

const fileNameCellRenderer = (cellRendererParams: FileNameCellRendererParams) =>
    baseCellRenderer(cellRendererParams, (cellValue: FileNameCellRendererCellData) => {
        const { id, name, isExternal } = cellValue;
        const extension = getFileExtension(name);
        const href = id ? `/file/${id}` : '';
        const displayName = isExternal ? <FormattedMessage {...commonMessages.externalFile} /> : name;
        const fileNameCellClass = classNames('FileNameCell-link', {
            'is-external': isExternal,
        });

        return (
            <span className="FileNameCell" title={displayName}>
                <FileIcon dimension={32} extension={extension} />
                <Link className={fileNameCellClass} href={href} rel="noopener noreferrer" target="_blank">
                    {displayName}
                </Link>
            </span>
        );
    });

export default fileNameCellRenderer;
