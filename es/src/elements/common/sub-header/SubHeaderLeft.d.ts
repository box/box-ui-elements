import * as React from 'react';
import type { View, Collection } from '../../../common/types/core';
export interface SubHeaderLeftProps {
    currentCollection: Collection;
    isSmall: boolean;
    onItemClick: (id: string | null, triggerNavigationEvent: boolean | null) => void;
    portalElement?: HTMLElement;
    rootId: string;
    rootName?: string;
    view: View;
}
declare const SubHeaderLeft: ({ currentCollection, isSmall, onItemClick, portalElement, rootId, rootName, view, }: SubHeaderLeftProps) => React.JSX.Element;
export default SubHeaderLeft;
