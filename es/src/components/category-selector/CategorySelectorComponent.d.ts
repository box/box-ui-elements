import * as React from 'react';
import './CategorySelector.scss';
import { Category } from './CategorySelector';
interface CategorySelectorComponentProps {
    categories: Category[];
    categoryProps: Record<string, unknown>;
    className: string;
    currentCategory: string;
    maxLinks: number;
    measureRef: (ref: Element | null) => void;
    moreRef: React.RefObject<HTMLDivElement>;
    onSelect: (value: string) => void;
}
declare const CategorySelectorComponent: ({ measureRef, moreRef, className, categories, maxLinks, currentCategory, categoryProps, onSelect, }: CategorySelectorComponentProps) => React.JSX.Element;
export default CategorySelectorComponent;
