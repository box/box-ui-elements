// @flow
import * as React from 'react';
import classNames from 'classnames';

import IconAlertDefault from '../../icons/general/IconAlertDefault';
import { bdlYellorange } from '../../styles/variables';
import './SecurityBadge.scss';

type Props = {
    className?: string,
    icon?: React.Node,
    message: string,
};

const SecurityBadge = ({ className, icon, message, ...rest }: Props) => {
    const iconElement = icon || <IconAlertDefault color={bdlYellorange} height={22} width={22} strokeWidth={3} />;

    return (
        <h1 className={classNames('bdl-SecurityBadge', className)} {...rest}>
            {iconElement}
            <span className="bdl-SecurityBadge-name">{message}</span>
        </h1>
    );
};

export default SecurityBadge;
