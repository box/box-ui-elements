import React from 'react';
import DropdownMenu from '../../../../components/dropdown-menu/DropdownMenu';
import Menu from '../../../../components/menu/Menu';
import MenuItem from '../../../../components/menu/MenuItem';
import Sort from '../Sort';
import SortButton from '../SortButton';
import messages from '../../messages';
import { SORT_ASC, SORT_DESC } from '../../../../constants';

describe('elements/SubHeader/Sort', () => {
    test('should render a button and menu with 4 menu items', () => {
        const wrapper = shallow(<Sort onSortChange={jest.fn()} sortBy="name" sortDirection={SORT_ASC} />);

        expect(wrapper.find(SortButton)).toHaveLength(1);
        expect(wrapper.find(DropdownMenu)).toHaveLength(1);
        expect(wrapper.find(Menu)).toHaveLength(1);
        expect(wrapper.find(MenuItem)).toHaveLength(6);
    });

    test('should render a select with 6 options', () => {
        const wrapper = shallow(<Sort onSortChange={jest.fn()} sortBy="name" sortDirection={SORT_ASC} />);
        const options = wrapper.find(MenuItem);

        expect(options).toHaveLength(6);
        expect(
            options
                .at(0)
                .childAt(0)
                .text(),
        ).toBe('<IconCheck />');
        expect(
            options
                .at(0)
                .childAt(1)
                .prop('id'),
        ).toBe(messages.nameASC.id);

        expect(
            options
                .at(1)
                .childAt(0)
                .text(),
        ).toBe('');
        expect(
            options
                .at(1)
                .childAt(1)
                .prop('id'),
        ).toBe(messages.nameDESC.id);

        expect(
            options
                .at(2)
                .childAt(0)
                .text(),
        ).toBe('');
        expect(
            options
                .at(2)
                .childAt(1)
                .prop('id'),
        ).toBe(messages.dateASC.id);

        expect(
            options
                .at(3)
                .childAt(0)
                .text(),
        ).toBe('');
        expect(
            options
                .at(3)
                .childAt(1)
                .prop('id'),
        ).toBe(messages.dateDESC.id);

        expect(
            options
                .at(4)
                .childAt(0)
                .text(),
        ).toBe('');
        expect(
            options
                .at(4)
                .childAt(1)
                .prop('id'),
        ).toBe(messages.sizeASC.id);

        expect(
            options
                .at(5)
                .childAt(0)
                .text(),
        ).toBe('');
        expect(
            options
                .at(5)
                .childAt(1)
                .prop('id'),
        ).toBe(messages.sizeDESC.id);
    });

    test('should pass correct parameters when clicked', () => {
        const sort = jest.fn();
        const wrapper = shallow(<Sort onSortChange={sort} sortBy="name" sortDirection={SORT_ASC} />);
        const options = wrapper.find(MenuItem);

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

    test('should render a select with correct option selected', () => {
        const wrapper = shallow(<Sort onSortChange={jest.fn()} sortBy="date" sortDirection={SORT_DESC} />);
        const options = wrapper.find(MenuItem);

        expect(options).toHaveLength(6);
        expect(
            options
                .at(3)
                .childAt(0)
                .text(),
        ).toBe('<IconCheck />');
        expect(
            options
                .at(3)
                .childAt(1)
                .prop('id'),
        ).toBe(messages.dateDESC.id);
    });
});
