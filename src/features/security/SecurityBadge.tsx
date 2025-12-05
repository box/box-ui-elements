import * as React from 'react';
import classNames from 'classnames';

import IconAlertDefault from '../../icons/general/IconAlertDefault';
import { bdlYellow50 } from '../../styles/variables';
import './SecurityBadge.scss';

export interface SecurityBadgeProps {
    className?: string;
    color?: string;
    icon?: React.ReactNode;
    message: React.ReactNode;
    strokeColor?: string;
}

const SecurityBadge = ({
    className,
    color,
    icon = <IconAlertDefault color={bdlYellow50} height={22} width={22} strokeWidth={3} />,
    message,
    ...rest
}: SecurityBadgeProps) => (
    <h1 className={classNames('bdl-SecurityBadge', className)} style={{ backgroundColor: color }} {...rest}>
        {icon}
        <span className="bdl-SecurityBadge-name">{message}</span>
    </h1>
);

export default SecurityBadge;
