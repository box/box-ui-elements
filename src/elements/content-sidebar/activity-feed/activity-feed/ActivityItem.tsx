import * as React from 'react';
import classNames from 'classnames';
import './ActivityItem.scss';

type Props = {
    children: React.ReactNode;
    className?: string;
    isFocused?: boolean;
    isHoverable?: boolean;
    hasNewThreadedReplies?: boolean;
};

function ActivityItem(
    { children, className, isFocused, isHoverable = false, hasNewThreadedReplies = false, ...rest }: Props,
    ref: React.Ref<HTMLLIElement>,
) {
    return (
        <li
            ref={ref}
            className={classNames('bcs-ActivityItem', className, {
                'bcs-is-focused': isFocused,
                'bcs-is-hoverable': isHoverable && hasNewThreadedReplies,
                hasNewThreadedReplies,
            })}
            {...rest}
        >
            {children}
        </li>
    );
}

export default React.forwardRef(ActivityItem);
