import * as React from 'react';
import type { Selection } from 'react-aria-components';
import type { Collection } from '../../../common/types/core';
import './SubHeaderLeftV2.scss';
export interface SubHeaderLeftV2Props {
    currentCollection: Collection;
    onClearSelectedItemIds?: () => void;
    rootName?: string;
    selectedItemIds: Selection;
    title?: string;
}
declare const SubHeaderLeftV2: (props: SubHeaderLeftV2Props) => React.JSX.Element;
export default SubHeaderLeftV2;
