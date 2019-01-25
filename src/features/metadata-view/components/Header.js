/** @flow */
import * as React from 'react';
import Draggable from 'react-draggable';

import type { HeaderData } from '../flowTypes';

import '../styles/Header.scss';

type Props = {
    headerData: HeaderData,
    resizeRow: ({ dataKey: string, deltaX: number }) => Object,
    shouldRenderResizeColumnIcon: boolean,
};

const Header = ({ headerData, resizeRow, shouldRenderResizeColumnIcon }: Props) => {
    const { dataKey, label } = headerData;
    return (
        <React.Fragment key={dataKey}>
            {shouldRenderResizeColumnIcon === true && (
                <Draggable
                    axis="x"
                    defaultClassName="drag-handle"
                    defaultClassNameDragging="DragHandleActive"
                    onDrag={(event, { deltaX }) => {
                        resizeRow({
                            dataKey,
                            deltaX,
                        });
                    }}
                    position={{ x: 0 }}
                    zIndex={999}
                >
                    <span className="drag-handle-icon">⋮</span>
                </Draggable>
            )}
            <div className="header-column-label">{label}</div>
        </React.Fragment>
    );
};

export default Header;
