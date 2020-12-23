import React from 'react';
import { shallow } from 'enzyme';

import CategorySelectorComponent from '../CategorySelectorComponent';

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

describe('components/category-selector/CategorySelector', () => {
    let wrapper;

    test('should render component correctly', () => {
        wrapper = shallow(
            <CategorySelectorComponent
                currentCategory="all"
                maxLinks={7}
                onSelect={() => {}}
                categories={categories}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should render component correctly with more dropdown', () => {
        wrapper = shallow(
            <CategorySelectorComponent
                currentCategory="all"
                maxLinks={4}
                onSelect={() => {}}
                categories={categories}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
