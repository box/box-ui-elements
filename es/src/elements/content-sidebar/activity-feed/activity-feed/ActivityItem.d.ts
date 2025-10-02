import * as React from 'react';
import './ActivityItem.scss';
type Props = {
    children: React.ReactNode;
    className?: string;
    isFocused?: boolean;
    isHoverable?: boolean;
    hasNewThreadedReplies?: boolean;
};
declare const _default: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLLIElement>>;
export default _default;
