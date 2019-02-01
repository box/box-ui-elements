import React from 'react';
import { mount, shallow } from 'enzyme';
import Button from 'components/button/Button';
import DropdownMenu from 'components/dropdown-menu/DropdownMenu';
import Menu from 'components/menu/Menu';
import MenuItem from 'components/menu/MenuItem';
import Sort from '../Sort';
import messages from '../../messages';
import { SORT_ASC, SORT_DESC } from '../../../../constants';

describe('elements/SubHeader/Sort', () => {
    test('should render a button and menu with 4 menu items', () => {
        const wrapper = shallow(
            <Sort isLoaded={false} onSortChange={jest.fn()} sortBy="name" sortDirection={SORT_ASC} />,
        );
        expect(wrapper.find(Button)).toHaveLength(1);
        expect(wrapper.find(DropdownMenu)).toHaveLength(1);
        expect(wrapper.find(Menu)).toHaveLength(1);
        expect(wrapper.find(MenuItem)).toHaveLength(4);
    });

    test('should render a select with 4 options', () => {
        const wrapper = shallow(
            <Sort isLoaded={false} onSortChange={jest.fn()} sortBy="name" sortDirection={SORT_ASC} />,
        );
        const options = wrapper.find(MenuItem);
        expect(options).toHaveLength(4);

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
    });

    test('should pass correct parameters when clicked', () => {
        const sort = jest.fn();
        const wrapper = shallow(<Sort isLoaded={false} onSortChange={sort} sortBy="name" sortDirection={SORT_ASC} />);
        const options = wrapper.find(MenuItem);

        options.at(0).simulate('click');
        expect(sort).toHaveBeenCalledWith('name', SORT_ASC);

        options.at(1).simulate('click');
        expect(sort).toHaveBeenCalledWith('name', SORT_DESC);

        options.at(2).simulate('click');
        expect(sort).toHaveBeenCalledWith('date', SORT_ASC);

        options.at(3).simulate('click');
        expect(sort).toHaveBeenCalledWith('date', SORT_DESC);
    });

    test('should render a select with correct option selected', () => {
        const wrapper = shallow(
            <Sort isLoaded={false} onSortChange={jest.fn()} sortBy="date" sortDirection={SORT_DESC} />,
        );
        const options = wrapper.find(MenuItem);
        expect(options).toHaveLength(4);

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

    test('should render a disabled button when isLoaded is false', () => {
        const wrapper = shallow(
            <Sort isLoaded={false} onSortChange={jest.fn()} sortBy="name" sortDirection={SORT_ASC} />,
        );
        expect(wrapper.find(Button).prop('isDisabled')).toBe(true);
    });

    test('should render a non-disabled button when isLoaded is true', () => {
        const wrapper = mount(<Sort isLoaded onSortChange={jest.fn()} sortBy="name" sortDirection={SORT_ASC} />);
        expect(wrapper.find(Button).prop('isDisabled')).toBe(false);
    });
});
