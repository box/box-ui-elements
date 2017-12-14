import React from 'react';
import { mount, shallow } from 'enzyme';
import { Button } from '../../Button';
import Sort from '../Sort';
import messages from '../../messages';
import DropdownMenu from '../../DropdownMenu';
import { Menu, MenuItem } from '../../Menu';
import { SORT_ASC, SORT_DESC } from '../../../constants';

describe('components/SubHeader/Sort', () => {
    test('should render a button and menu with 6 menu items', () => {
        const wrapper = shallow(
            <Sort isLoaded={false} sortBy='name' sortDirection={SORT_ASC} onSortChange={jest.fn()} />
        );
        expect(wrapper.find(Button)).toHaveLength(1);
        expect(wrapper.find(DropdownMenu)).toHaveLength(1);
        expect(wrapper.find(Menu)).toHaveLength(1);
        expect(wrapper.find(MenuItem)).toHaveLength(6);
    });

    test('should render a select with 6 options', () => {
        const wrapper = shallow(
            <Sort isLoaded={false} sortBy='name' sortDirection={SORT_ASC} onSortChange={jest.fn()} />
        );
        const options = wrapper.find(MenuItem);
        expect(options).toHaveLength(6);

        expect(options.at(0).childAt(0).text()).toBe('<IconCheck />');
        expect(options.at(0).childAt(1).prop('id')).toBe(messages.nameASC.id);

        expect(options.at(1).childAt(0).text()).toBe('');
        expect(options.at(1).childAt(1).prop('id')).toBe(messages.nameDESC.id);

        expect(options.at(2).childAt(0).text()).toBe('');
        expect(options.at(2).childAt(1).prop('id')).toBe(messages.dateASC.id);

        expect(options.at(3).childAt(0).text()).toBe('');
        expect(options.at(3).childAt(1).prop('id')).toBe(messages.dateDESC.id);

        expect(options.at(4).childAt(0).text()).toBe('');
        expect(options.at(4).childAt(1).prop('id')).toBe(messages.sizeASC.id);

        expect(options.at(5).childAt(0).text()).toBe('');
        expect(options.at(5).childAt(1).prop('id')).toBe(messages.sizeDESC.id);
    });

    test('should pass correct parameters when clicked', () => {
        const sort = jest.fn();
        const wrapper = shallow(<Sort isLoaded={false} sortBy='name' sortDirection={SORT_ASC} onSortChange={sort} />);
        const options = wrapper.find(MenuItem);

        options.at(0).simulate('click');
        expect(sort).toHaveBeenCalledWith('name', SORT_ASC);

        options.at(1).simulate('click');
        expect(sort).toHaveBeenCalledWith('name', SORT_DESC);

        options.at(2).simulate('click');
        expect(sort).toHaveBeenCalledWith('modified_at', SORT_ASC);

        options.at(3).simulate('click');
        expect(sort).toHaveBeenCalledWith('modified_at', SORT_DESC);

        options.at(4).simulate('click');
        expect(sort).toHaveBeenCalledWith('size', SORT_ASC);

        options.at(5).simulate('click');
        expect(sort).toHaveBeenCalledWith('size', SORT_DESC);
    });

    test('should pass correct parameters when clicked when view is recents', () => {
        const sort = jest.fn();
        const wrapper = shallow(
            <Sort isRecents isLoaded={false} sortBy='name' sortDirection={SORT_ASC} onSortChange={sort} />
        );
        const options = wrapper.find(MenuItem);

        options.at(2).simulate('click');
        expect(sort).toHaveBeenCalledWith('interacted_at', SORT_ASC);

        options.at(3).simulate('click');
        expect(sort).toHaveBeenCalledWith('interacted_at', SORT_DESC);
    });

    test('should render a select with correct option selected', () => {
        const wrapper = shallow(
            <Sort isLoaded={false} sortBy='modified_at' sortDirection={SORT_DESC} onSortChange={jest.fn()} />
        );
        const options = wrapper.find(MenuItem);
        expect(options).toHaveLength(6);

        expect(options.at(3).childAt(0).text()).toBe('<IconCheck />');
        expect(options.at(3).childAt(1).prop('id')).toBe(messages.dateDESC.id);
    });

    test('should render a disabled button when isLoaded is false', () => {
        const wrapper = shallow(
            <Sort isLoaded={false} sortBy='name' sortDirection={SORT_ASC} onSortChange={jest.fn()} />
        );
        expect(wrapper.find(Button).prop('isDisabled')).toBe(true);
    });

    test('should render a non-disabled button when isLoaded is true', () => {
        const wrapper = mount(<Sort isLoaded sortBy='name' sortDirection={SORT_ASC} onSortChange={jest.fn()} />);
        expect(wrapper.find(Button).prop('isDisabled')).toBe(false);
    });
});
