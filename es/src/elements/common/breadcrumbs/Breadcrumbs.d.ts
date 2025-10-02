import * as React from 'react';
import type { Crumb, Delimiter } from '../../../common/types/core';
import './Breadcrumbs.scss';
export interface BreadcrumbsProps {
    crumbs: Crumb[];
    delimiter: Delimiter;
    isSmall?: boolean;
    onCrumbClick: (item: string) => void;
    portalElement?: HTMLElement;
    rootId: string;
}
declare const Breadcrumbs: ({ crumbs, delimiter, isSmall, onCrumbClick, portalElement, rootId }: BreadcrumbsProps) => React.JSX.Element;
export default Breadcrumbs;
