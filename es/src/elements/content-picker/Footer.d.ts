import * as React from 'react';
import type { Collection, BoxItem } from '../../common/types/core';
import './Footer.scss';
interface Props {
    cancelButtonLabel?: string;
    children?: React.ReactNode;
    chooseButtonLabel?: string;
    currentCollection: Collection;
    hasHitSelectionLimit: boolean;
    isSingleSelect: boolean;
    onCancel: () => void;
    onChoose: () => void;
    onSelectedClick: () => void;
    renderCustomActionButtons?: (options: {
        currentFolderId: string;
        currentFolderName: string;
        onCancel: () => void;
        onChoose: () => void;
        selectedCount: number;
        selectedItems: BoxItem[];
    }) => React.ReactNode;
    selectedCount: number;
    selectedItems: BoxItem[];
    showSelectedButton: boolean;
}
declare const Footer: ({ currentCollection, selectedCount, selectedItems, onSelectedClick, hasHitSelectionLimit, isSingleSelect, onCancel, onChoose, chooseButtonLabel, cancelButtonLabel, children, renderCustomActionButtons, showSelectedButton, }: Props) => React.ReactElement;
export default Footer;
