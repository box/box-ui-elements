// @flow
import * as React from 'react';
import classNames from 'classnames';

import IconAlertDefault from '../../icons/general/IconAlertDefault';
import { bdlYellow50 } from '../../styles/variables';
import './SecurityBadge.scss';

type Props = {
    className?: string,
    color?: string,
    icon?: React.Node,
    message: React.Node,
    strokeColor?: string,
};

const SecurityBadge = ({ className, color, icon, message, ...rest }: Props) => (
    <h1 className={classNames('bdl-SecurityBadge', className)} style={{ backgroundColor: color }} {...rest}>
        {icon}
        <span className="bdl-SecurityBadge-name">{message}</span>
    </h1>
);

SecurityBadge.defaultProps = {
    icon: <IconAlertDefault color={bdlYellow50} height={22} width={22} strokeWidth={3} />,
};

export default SecurityBadge;
