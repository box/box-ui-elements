import * as React from 'react';
import classNames from 'classnames';
import './ActivityCard.scss';

export type Props = React.HTMLAttributes<HTMLDivElement>;

const ActivityCard = (props: Props, ref: React.Ref<HTMLDivElement>): JSX.Element => {
    const { children, className, ...rest } = props;
    return (
        <div ref={ref} className={classNames('bcs-ActivityCard', className)} {...rest}>
            {children}
        </div>
    );
};

export default React.forwardRef(ActivityCard);
