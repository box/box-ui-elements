/**
 * @file Share Access Select component
 * @author Box
 */
import * as React from 'react';
import type { BoxItem } from '../../../common/types/core';
import './ShareAccessSelect.scss';
export interface ShareAccessSelectProps {
    canSetShareAccess: boolean;
    className: string;
    item: BoxItem;
    onChange: (value: string, item: BoxItem) => void;
}
declare const ShareAccessSelect: ({ className, canSetShareAccess, onChange, item }: ShareAccessSelectProps) => React.JSX.Element;
export default ShareAccessSelect;
