import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import QuickSearchSelector from '../QuickSearchSelector';

describe('features/quick-search/QuickSearchSelector', () => {
    const sandbox = sinon.sandbox.create();

    const onInputStub = sandbox.stub();

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    test('should render default component', () => {
        const placeholder = 'Search';
        const wrapper = shallow(<QuickSearchSelector onInput={onInputStub} placeholder={placeholder} />);
        const input = wrapper.children();

        expect(wrapper.hasClass('quick-search-selector')).toBe(true);
        expect(input.is('input')).toBe(true);
        expect(input.prop('aria-label')).toEqual(placeholder);
        expect(input.prop('onInput')).toEqual(onInputStub);
        expect(input.prop('placeholder')).toEqual(placeholder);
    });

    test('should render class name on input when specified', () => {
        const className = 'test';
        const wrapper = shallow(
            <QuickSearchSelector className={className} onInput={onInputStub} placeholder="Search" />,
        );
        const input = wrapper.find('input');

        expect(input.hasClass('search-input')).toBe(true);
        expect(input.hasClass(className)).toBe(true);
    });

    test('should pass input props when specified', () => {
        const role = 'combobox';
        const wrapper = shallow(
            <QuickSearchSelector inputProps={{ role }} onInput={onInputStub} placeholder="Search" />,
        );

        expect(wrapper.find('input').prop('role')).toEqual(role);
    });

    test('should render loading indicator when isLoading is true', () => {
        const wrapper = shallow(<QuickSearchSelector isLoading onInput={onInputStub} placeholder="Search" />);

        expect(wrapper.find('LoadingIndicator').length).toBe(1);
    });

    test('should pass through additional props when specified', () => {
        const target = 'searchbar';
        const wrapper = shallow(
            <QuickSearchSelector data-resin-target={target} onInput={onInputStub} placeholder="Search" />,
        );

        expect(wrapper.find('input').prop('data-resin-target')).toEqual(target);
    });

    test('should set input ref when specified', () => {
        let inputEl;
        const inputRef = input => {
            inputEl = input;
        };

        mount(<QuickSearchSelector inputRef={inputRef} onInput={onInputStub} placeholder="Search" />);

        expect(inputEl.nodeName).toEqual('INPUT');
    });
});
