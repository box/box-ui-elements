import * as React from 'react';

import CategorySelector from './CategorySelector';
import notes from './CategorySelector.stories.md';

const categories = [
    {
        value: 'all',
        displayText: 'All',
    },
    {
        value: 'legal',
        displayText: 'Legal',
    },
    {
        value: 'marketing',
        displayText: 'Marketing',
    },
    {
        value: 'hr',
        displayText: 'HR',
    },
    {
        value: 'bizops',
        displayText: 'Business Operations',
    },
    {
        value: 'sales',
        displayText: 'Sales',
    },
    {
        value: 'finance',
        displayText: 'Finance',
    },
];

const CategorySelectorContainer = () => {
    const [category, setCategory] = React.useState('all');

    return (
        <CategorySelector
            categories={categories}
            currentCategory={category}
            onSelect={value => {
                setCategory(value);
            }}
        />
    );
};

export const basic = () => <CategorySelectorContainer />;

export const withDropdown = () => {
    return (
        <div style={{ width: 400 }}>
            <CategorySelectorContainer />
        </div>
    );
};

export default {
    title: 'Components|CategorySelector',
    component: CategorySelector,
    parameters: {
        notes,
    },
};
