// @flow
import * as React from 'react';

import baseCellRenderer from './baseCellRenderer';
import type { UserCellRendererCellData, UserCellRendererParams } from './flowTypes';
import FormattedUser from './FormattedUser';

const userCellRenderer = (cellRendererParams: UserCellRendererParams) =>
    baseCellRenderer(cellRendererParams, ({ id, email, name, login }: UserCellRendererCellData) => (
        <FormattedUser id={id} email={email || login} name={name} />
    ));

export default userCellRenderer;
