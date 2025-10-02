import React from 'react';
import type { View } from '../../../common/types/core';
export interface EmptyViewProps {
    isLoading: boolean;
    view: View;
}
declare const EmptyView: ({ isLoading, view }: EmptyViewProps) => React.JSX.Element;
export default EmptyView;
