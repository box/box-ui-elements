import * as React from 'react';
import './CategorySelector.scss';
export interface Category {
    displayText: string;
    value: string;
}
export interface CategorySelectorProps {
    /** Array of categories that will display in the selector, each category is an object with a string value and a string displayText */
    categories: Category[];
    /** Optional props that can be passed to each category in category selector component */
    categoryProps?: Record<string, unknown>;
    /** Optional className that can be passed to category selector component */
    className?: string;
    /** Optional value of initial selected category */
    currentCategory?: string;
    /** Parent component can use this on select handler to update state for selected category */
    onSelect: (value: string) => void;
}
declare const CategorySelector: ({ categories, categoryProps, className, currentCategory, onSelect, }: CategorySelectorProps) => React.JSX.Element;
export default CategorySelector;
