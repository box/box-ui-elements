import * as React from 'react';
import type { Crumb } from '../../../common/types/core';
export interface BreadcrumbDropdownProps {
    crumbs: Crumb[];
    onCrumbClick: (item: string) => void;
    portalElement?: HTMLElement;
}
declare const BreadcrumbDropdown: ({ crumbs, onCrumbClick, portalElement }: BreadcrumbDropdownProps) => React.JSX.Element;
export default BreadcrumbDropdown;
