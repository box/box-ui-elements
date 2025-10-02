import * as React from 'react';
import type { Delimiter } from '../../../common/types/core';
import './Breadcrumb.scss';
export interface BreadcrumbProps {
    delimiter?: Delimiter;
    isLast?: boolean;
    name: string;
    onClick?: () => void;
}
declare const Breadcrumb: ({ name, onClick, isLast, delimiter }: BreadcrumbProps) => React.JSX.Element;
export default Breadcrumb;
