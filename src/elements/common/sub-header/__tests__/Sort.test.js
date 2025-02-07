import * as React from 'react';
import { DropdownMenu, IconButton } from '@box/blueprint-web';
import Sort from '../Sort';
import { SORT_ASC, SORT_DESC } from '../../../../constants';

import messages from '../../messages';

describe('elements/common/sub-header/Sort', () => {
    test('should render a button and menu with 4 select menu items', () => {
        const wrapper = shallow(<Sort onSortChange={jest.fn()} sortBy="name" sortDirection={SORT_ASC} />);

        expect(wrapper.find(IconButton)).toHaveLength(1);
        expect(wrapper.find(DropdownMenu.Content)).toHaveLength(1);
        expect(wrapper.find(DropdownMenu.Item)).toHaveLength(6);
    });

    test('should render a select with 6 options', () => {
        const wrapper = shallow(<Sort onSortChange={jest.fn()} sortBy="name" sortDirection={SORT_ASC} />);
        const options = wrapper.find(DropdownMenu.Item);

        expect(options).toHaveLength(6);
        expect(options.at(0).childAt(0).prop('id')).toBe(messages.nameASC.id);
        expect(options.at(1).childAt(0).prop('id')).toBe(messages.nameDESC.id);
        expect(options.at(2).childAt(0).prop('id')).toBe(messages.dateASC.id);
        expect(options.at(3).childAt(0).prop('id')).toBe(messages.dateDESC.id);
        expect(options.at(4).childAt(0).prop('id')).toBe(messages.sizeASC.id);
        expect(options.at(5).childAt(0).prop('id')).toBe(messages.sizeDESC.id);
    });

    test('should pass correct parameters when clicked', () => {
        const sort = jest.fn();
        const wrapper = shallow(<Sort onSortChange={sort} sortBy="name" sortDirection={SORT_ASC} />);
        const options = wrapper.find(DropdownMenu.Item);

        options.at(0).simulate('click');
        expect(sort).toHaveBeenCalledWith('name', SORT_ASC);

        options.at(1).simulate('click');
        expect(sort).toHaveBeenCalledWith('name', SORT_DESC);

        options.at(2).simulate('click');
        expect(sort).toHaveBeenCalledWith('date', SORT_ASC);

        options.at(3).simulate('click');
        expect(sort).toHaveBeenCalledWith('date', SORT_DESC);

        options.at(4).simulate('click');
        expect(sort).toHaveBeenCalledWith('size', SORT_ASC);

        options.at(5).simulate('click');
        expect(sort).toHaveBeenCalledWith('size', SORT_DESC);
    });

    test('should only have one option selected', () => {
        const wrapper = shallow(<Sort onSortChange={jest.fn()} sortBy="date" sortDirection={SORT_DESC} />);
        const options = wrapper.find(DropdownMenu.Item);

        expect(options.at(3).prop('isSelected')).toBe(true);
        options.forEach((option, i) => {
            if (i !== 3) expect(option.prop('isSelected')).toBe(false);
        });
    });
});
