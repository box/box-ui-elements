import * as React from 'react';
import classNames from 'classnames';
import './ActivityCard.scss';

export type Props = React.HTMLAttributes<HTMLDivElement>;

const ActivityCard = ({ children, className, ...rest }: Props): JSX.Element => (
    <div className={classNames('bcs-ActivityCard', className)} {...rest}>
        {children}
    </div>
);

export default ActivityCard;
