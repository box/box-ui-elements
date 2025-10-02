import * as React from 'react';
import type { Selection } from 'react-aria-components';
export interface BulkItemAction {
    label: string;
    onClick: (selectedItemIds: Selection) => void;
}
export interface BulkItemActionMenuProps {
    actions: BulkItemAction[];
    selectedItemIds: Selection;
}
export declare const BulkItemActionMenu: ({ actions, selectedItemIds }: BulkItemActionMenuProps) => React.JSX.Element;
