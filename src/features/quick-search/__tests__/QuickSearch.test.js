import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import QuickSearch from '../QuickSearch';

describe('features/quick-search/QuickSearch', () => {
    const sandbox = sinon.sandbox.create();
    const inputProps = {
        onInput: () => {},
        placeholder: 'Search',
    };

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        test('should render default component', () => {
            const wrapper = shallow(<QuickSearch inputProps={inputProps} />);

            expect(wrapper.hasClass('quick-search')).toBe(true);
            expect(wrapper.find('SelectorDropdown').length).toBe(1);
            expect(wrapper.find('QuickSearchMessage').length).toBe(0);
        });

        test('should pass props through to selector dropdown', () => {
            const children = <li />;
            const onSelect = () => {};
            const wrapper = shallow(
                <QuickSearch inputProps={inputProps} onSelect={onSelect}>
                    {children}
                </QuickSearch>,
            );
            const selectorDropdown = wrapper.find('SelectorDropdown');

            expect(selectorDropdown.prop('onSelect')).toEqual(onSelect);
            expect(selectorDropdown.contains(children)).toBe(true);
        });

        test('should pass input props through to input', () => {
            const wrapper = mount(<QuickSearch inputProps={inputProps} />);
            const input = wrapper.find('input');

            expect(input.prop('onInput')).toEqual(inputProps.onInput);
            expect(input.prop('placeholder')).toEqual(inputProps.placeholder);
        });

        test('should render component with class when specified', () => {
            const className = 'test';
            const wrapper = shallow(<QuickSearch className={className} inputProps={inputProps} />);

            expect(wrapper.hasClass('quick-search')).toBe(true);
            expect(wrapper.hasClass(className)).toBe(true);
        });

        test('should render error message when specified', () => {
            const error = 'error';
            const wrapper = shallow(<QuickSearch errorMessage={error} inputProps={inputProps} />);
            const message = wrapper.find('QuickSearchMessage');

            expect(message.length).toBe(1);
            expect(message.contains(error)).toBe(true);
            expect(message.prop('isShown')).toBe(false);
        });

        test('should show error message when specified and showMessage is true', () => {
            const wrapper = shallow(<QuickSearch errorMessage="error" inputProps={inputProps} />);
            wrapper.setState({ showMessage: true });

            expect(wrapper.find('QuickSearchMessage').prop('isShown')).toBe(true);
        });

        test('should render no items message when specified', () => {
            const noItems = 'no items';
            const wrapper = shallow(<QuickSearch inputProps={inputProps} noItemsMessage={noItems} />);
            const message = wrapper.find('QuickSearchMessage');

            expect(message.length).toBe(1);
            expect(message.contains(noItems)).toBe(true);
            expect(message.prop('isShown')).toBe(false);
        });

        test('should show no items message when specified and showMessage is true', () => {
            const wrapper = shallow(<QuickSearch inputProps={inputProps} noItemsMessage="no items" />);
            wrapper.setState({ showMessage: true });

            expect(wrapper.find('QuickSearchMessage').prop('isShown')).toBe(true);
        });

        test('should render divider when specified', () => {
            const children = (
                <>
                    <li key="1" />
                    <li key="2" />
                </>
            );
            const dividerIndex = 1;
            const wrapper = shallow(
                <QuickSearch dividerIndex={dividerIndex} inputProps={inputProps}>
                    {children}
                </QuickSearch>,
            );
            const selectorDropdown = wrapper.find('SelectorDropdown');

            expect(selectorDropdown.prop('dividerIndex')).toEqual(1);
        });
    });

    describe('onFocus', () => {
        test('should set showMessage state to true when focused', () => {
            const wrapper = shallow(<QuickSearch inputProps={inputProps} />);

            wrapper.simulate('focus');

            expect(wrapper.state('showMessage')).toBe(true);
        });
    });

    describe('onBlur', () => {
        test('should set showMessage state to false when blurred', () => {
            const wrapper = shallow(<QuickSearch inputProps={inputProps} />);
            wrapper.setState({ showMessage: true });

            wrapper.simulate('blur');

            expect(wrapper.state('showMessage')).toBe(false);
        });
    });
});
