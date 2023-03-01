import * as React from 'react';
import classNames from 'classnames';

type Props = {
    children: React.ReactNode;
    className?: string;
    isFocused?: boolean;
};

function ActivityItem({ children, className, isFocused, ...rest }: Props, ref: React.Ref<HTMLLIElement>) {
    return (
        <li className={classNames('bcs-ActivityItem', className, { 'bcs-is-focused': isFocused })} ref={ref} {...rest}>
            {children}
        </li>
    );
}

export default React.forwardRef(ActivityItem);
