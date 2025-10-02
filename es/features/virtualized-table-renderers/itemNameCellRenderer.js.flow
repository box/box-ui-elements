// @flow
import * as React from 'react';
import classNames from 'classnames';

import noop from 'lodash/noop';
import { getFileExtension } from '../../utils/file';
import messages from './messages';
import FileIcon from '../../icons/file-icon';
import FolderIcon from '../../icons/folder-icon';
import PlainButton from '../../components/plain-button/PlainButton';
import baseCellRenderer from './baseCellRenderer';
import type { ItemNameCellRendererCellData, ItemNameCellRendererParams } from './flowTypes';
import './ItemNameCell.scss';

const itemNameCellRenderer = (intl: any, onClick?: Function = noop) => (
    cellRendererParams: ItemNameCellRendererParams,
) =>
    baseCellRenderer(cellRendererParams, (cellValue: ItemNameCellRendererCellData) => {
        const { name, type, isExternal, dataAttributes } = cellValue;
        const extension = getFileExtension(name);
        const displayName = isExternal ? intl.formatMessage(messages.externalFile) : name;
        const isFolder = type === 'folder';
        const itemNameCellClass = classNames('bdl-ItemNameCell-name', {
            'bdl-is-external': isExternal,
            'bdl-is-folder': isFolder,
        });

        return (
            <span className="bdl-ItemNameCell" title={displayName}>
                {isFolder ? (
                    <>
                        <FolderIcon dimension={32} isExternal={isExternal} />
                        <PlainButton
                            className={itemNameCellClass}
                            onClick={() => onClick(cellValue)}
                            type="button"
                            {...dataAttributes}
                        >
                            {displayName}
                        </PlainButton>
                    </>
                ) : (
                    <>
                        <FileIcon dimension={32} extension={extension} />
                        <span className={itemNameCellClass} {...dataAttributes}>
                            {displayName}
                        </span>
                    </>
                )}
            </span>
        );
    });

export default itemNameCellRenderer;
