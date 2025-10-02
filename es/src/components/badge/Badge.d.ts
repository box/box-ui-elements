import * as React from 'react';
import { BadgeType } from './types';
import './Badge.scss';
type Props = {
    /** Child components */
    children: React.ReactNode;
    /** Adds a class to the component */
    className?: string;
    /** A predefined badge type */
    type?: BadgeType;
};
declare const Badge: ({ children, className, type, ...rest }: Props) => React.JSX.Element;
export default Badge;
