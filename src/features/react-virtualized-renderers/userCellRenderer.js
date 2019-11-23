// @flow
import { formatTargetUser } from '../../utils/targetUser';
import baseCellRenderer from './baseCellRenderer';

import type { UserCellRendererCellData, UserCellRendererParams } from './flowTypes';

const userCellRenderer = (cellRendererParams: UserCellRendererParams) =>
    baseCellRenderer(cellRendererParams, ({ id, email, name, login }: UserCellRendererCellData) =>
        formatTargetUser({ id, email: email || login, name }),
    );

export default userCellRenderer;
