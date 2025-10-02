import * as React from 'react';
import './SidebarNavSign.scss';
import type { TargetingApi } from '../../features/targeting/types';
export interface SignSidebarProps {
    blockedReason: string;
    enabled: boolean;
    onClick: () => void;
    onClickSignMyself: () => void;
    targetingApi?: TargetingApi;
}
export declare function SidebarNavSign(signSidebarProps: SignSidebarProps): React.JSX.Element;
export default SidebarNavSign;
