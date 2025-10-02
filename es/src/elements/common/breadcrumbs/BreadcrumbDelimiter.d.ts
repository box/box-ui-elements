import * as React from 'react';
import type { Delimiter } from '../../../common/types/core';
export interface BreadcrumbDelimiterProps {
    delimiter?: Delimiter;
}
declare const BreadcrumbDelimiter: ({ delimiter }: BreadcrumbDelimiterProps) => React.JSX.Element;
export default BreadcrumbDelimiter;
