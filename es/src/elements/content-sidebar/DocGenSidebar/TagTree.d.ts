import * as React from 'react';
import './DocGenSidebar.scss';
import { JsonPathsMap } from './types';
interface TagTreeProps {
    data?: JsonPathsMap;
    level?: number;
}
declare const TagTree: ({ data, level }: TagTreeProps) => React.JSX.Element;
export default TagTree;
