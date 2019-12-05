// @flow
import * as React from 'react';
import classNames from 'classnames';
import type { IntlShape } from 'react-intl';
import noop from 'lodash/noop';
import { getFileExtension } from '../../utils/file';
import messages from './messages';
import FileIcon from '../../icons/file-icon';
import FolderIcon from '../../icons/folder-icon';
import PlainButton from '../../components/plain-button/PlainButton';
import baseCellRenderer from './baseCellRenderer';
import type { ItemNameCellRendererCellData, ItemNameCellRendererParams } from './flowTypes';
import './ItemNameCell.scss';

const itemNameCellRenderer = (intl: IntlShape, onClick?: Function = noop) => (
    cellRendererParams: ItemNameCellRendererParams,
) =>
    baseCellRenderer(cellRendererParams, (cellValue: ItemNameCellRendererCellData) => {
        const { name, type, isExternal } = cellValue;
        const extension = getFileExtension(name);
        const displayName = isExternal ? intl.formatMessage(messages.externalFile) : name;
        const isFolder = type === 'folder';
        const fileNameCellClass = classNames('bdl-ItemNameCell-name', {
            'is-external': isExternal,
            'is-folder': isFolder,
        });

        return (
            <span className="bdl-ItemNameCell" title={displayName}>
                {isFolder ? (
                    <>
                        <FolderIcon dimension={32} isExternal={isExternal} />
                        <PlainButton className={fileNameCellClass} onClick={() => onClick(cellValue)} type="button">
                            {displayName}
                        </PlainButton>
                    </>
                ) : (
                    <>
                        <FileIcon dimension={32} extension={extension} />
                        <span className={fileNameCellClass}>{displayName}</span>
                    </>
                )}
            </span>
        );
    });

export default itemNameCellRenderer;
