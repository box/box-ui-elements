import React from 'react';
import sinon from 'sinon';

import { ContentExplorerSearchBase as ContentExplorerSearch } from '../ContentExplorerSearch';

describe('features/content-explorer/content-explorer/ContentExplorerSearch', () => {
    const sandbox = sinon.sandbox.create();

    const renderComponent = props => shallow(<ContentExplorerSearch intl={{ formatMessage: () => {} }} {...props} />);

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        test('should render the default component', () => {
            const wrapper = renderComponent();
            const instance = wrapper.instance();

            expect(wrapper.is('SearchForm')).toBe(true);
            expect(wrapper.prop('onChange')).toEqual(instance.handleChange);
            expect(wrapper.prop('onSubmit')).toEqual(instance.handleSubmit);
        });

        test('should render the input when specified', () => {
            const inputValue = 'i am input';
            const wrapper = renderComponent({ inputValue });

            expect(wrapper.prop('value')).toEqual(inputValue);
        });

        test('should set custom search input props when specified', () => {
            const wrapper = renderComponent({
                searchInputProps: { 'data-resin-target': 'searchbar' },
            });
            expect(wrapper.prop('data-resin-target')).toEqual('searchbar');
        });
    });

    describe('onSubmit', () => {
        test('should call onSubmit when submitted', () => {
            const onSubmitSpy = sandbox.spy();
            const wrapper = renderComponent({
                onSubmit: onSubmitSpy,
            });
            const event = { preventDefault: sandbox.mock() };

            wrapper.instance().handleSubmit('test', event);

            expect(onSubmitSpy.calledOnce).toBe(true);
        });
    });

    describe('onChange', () => {
        test('should call onInput when input changes', () => {
            const input = 'i am input';
            const onInputSpy = sandbox.spy();
            const wrapper = renderComponent({
                onInput: onInputSpy,
            });

            wrapper.instance().handleChange(input);

            expect(onInputSpy.calledOnce).toBe(true);
            expect(onInputSpy.calledWithExactly(input)).toBe(true);
        });

        test('should call onClearButtonClick when value is changed to empty string', () => {
            const onClearButtonClickSpy = sandbox.spy();
            const wrapper = renderComponent({
                onClearButtonClick: onClearButtonClickSpy,
            });

            wrapper.instance().handleChange('');

            expect(onClearButtonClickSpy.calledOnce).toBe(true);
        });
    });
});
