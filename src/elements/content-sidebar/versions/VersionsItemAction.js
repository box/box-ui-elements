/**
 * @flow strict
 * @file Versions Item Action component
 * @author Box
 */

import * as React from 'react';
import PlainButton from '../../../components/plain-button';
import './VersionsItemAction.scss';

type Props = {
    action: string,
    children: React.Node,
    fileId: string,
    isCurrent: boolean,
};

const VersionsItemAction = ({ action, children, fileId, isCurrent, ...rest }: Props) => (
    <li className="bcs-VersionsItemAction">
        <PlainButton // Button element is required to trigger resin events
            className="bcs-VersionsItemAction-button menu-item"
            data-resin-iscurrent={isCurrent}
            data-resin-itemid={fileId}
            data-resin-target={action}
            role="menuitem"
            type="button"
            {...rest}
        >
            {children}
        </PlainButton>
    </li>
);

export default VersionsItemAction;
