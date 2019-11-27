// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import type { RouterLinkCellRendererParams } from './flowTypes';

const routerLinkCellRenderer = (
    { cellData }: RouterLinkCellRendererParams,
    onClick: (SyntheticMouseEvent<>) => void = () => {},
) => {
    const { icon, label = '', to = '' } = cellData || {};

    return (
        <span className="VirtualizedTable-routerLinkCell">
            {icon && <span className="VirtualizedTable-icon">{icon}</span>}
            <Link className="VirtualizedTable-link" onClick={onClick} title={label} to={to}>
                {label}
            </Link>
        </span>
    );
};

export default routerLinkCellRenderer;
