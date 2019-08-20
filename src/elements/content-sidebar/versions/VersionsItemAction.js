/**
 * @flow strict
 * @file Versions Item Action component
 * @author Box
 */

import * as React from 'react';
import { MenuItem } from '../../../components/menu';
import './VersionsItemAction.scss';

type Props = {
    action: string,
    children: React.Node,
    fileId: string,
    isCurrent: boolean,
};

const VersionsItemAction = ({ action, children, fileId, isCurrent, ...rest }: Props) => (
    <MenuItem
        className="bcs-VersionsItemAction"
        data-resin-iscurrent={isCurrent}
        data-resin-itemid={fileId}
        data-resin-target={action}
        {...rest}
    >
        {children}
    </MenuItem>
);

export default VersionsItemAction;
