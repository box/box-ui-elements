import * as React from 'react';
import type { BoxItem } from '../../../common/types/core';
import './InlineBreadcrumbs.scss';
export interface InlineBreadcrumbsProps {
    item: BoxItem;
    onItemClick: (item: BoxItem | string) => void;
    rootId: string;
}
declare const InlineBreadcrumbs: ({ item, onItemClick, rootId }: InlineBreadcrumbsProps) => React.JSX.Element;
export default InlineBreadcrumbs;
