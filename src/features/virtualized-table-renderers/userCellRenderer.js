// @flow

import baseCellRenderer from './baseCellRenderer';
import { formatUser } from './FormattedUser';
import type { UserCellRendererCellData, UserCellRendererParams } from './flowTypes';

const userCellRenderer = (intl: any) => (cellRendererParams: UserCellRendererParams) =>
    baseCellRenderer(cellRendererParams, ({ id, email, name, login }: UserCellRendererCellData) =>
        formatUser({ id, email: email || login, name }, intl),
    );

export default userCellRenderer;
