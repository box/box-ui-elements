import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import SearchForm from '..';

let clock;
const sandbox = sinon.sandbox.create();
const intlShape = {
    formatMessage: message => message.id,
};

describe('components/search-form/SearchForm', () => {
    beforeEach(() => {
        clock = sinon.useFakeTimers();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
        clock.restore();
    });

    test('should correctly render default component', () => {
        const wrapper = mount(<SearchForm placeholder="search" />);
        expect(wrapper.find('form').length === 1).toBeTruthy();
        expect(wrapper.find('input').length === 1).toBeTruthy();
        expect(wrapper.find('button').length === 2).toBeTruthy();
        expect(wrapper.find('form').prop('method')).toEqual('get');
        expect(wrapper.find('input').prop('name')).toEqual('search');
        expect(wrapper.find('form').hasClass('search-form')).toBeTruthy();
        expect(wrapper.find('input').hasClass('search-input')).toBeTruthy();
        expect(
            wrapper
                .find('button')
                .at(0)
                .hasClass('search-button'),
        ).toBeTruthy();
        expect(
            wrapper
                .find('button')
                .at(1)
                .hasClass('clear-button'),
        ).toBeTruthy();
    });

    test('should call onsubmit on search icon click', () => {
        const onSubmitSpy = sinon.spy();
        const event = {
            target: {
                elements: [
                    {
                        value: 'cheese',
                    },
                ],
            },
        };
        const wrapper = mount(<SearchForm onSubmit={onSubmitSpy} placeholder="search" value="cheese" />);
        const form = wrapper.find('form');
        form.simulate('submit', event);
        sinon.assert.calledWithMatch(onSubmitSpy, 'cheese', event);
    });

    test('should call onchange on form change', () => {
        const onChangeSpy = sinon.spy();
        const wrapper = mount(<SearchForm onChange={onChangeSpy} placeholder="search" value="cheese" />);
        const form = wrapper.find('form');
        form.simulate('change');
        sinon.assert.called(onChangeSpy);
    });

    test('should set the form method to post', () => {
        const wrapper = mount(<SearchForm method="post" placeholder="search" />);
        const form = wrapper.find('form');
        expect(form.prop('method')).toEqual('post');
    });

    test('should set the name to query in the input by default', () => {
        const wrapper = mount(<SearchForm name="query" placeholder="search" />);
        const input = wrapper.find('input');
        expect(input.prop('name')).toEqual('query');
    });

    test('should generate a hidden input field with correct name and value', () => {
        const queryParams = {
            token: '123',
            number: 123,
        };
        const wrapper = mount(<SearchForm name="query" placeholder="search" queryParams={queryParams} />);
        const inputs = wrapper.find('input');
        expect(inputs.at(0).prop('name')).toEqual('query');
        expect(inputs.at(1).prop('name')).toEqual('token');
        expect(inputs.at(1).prop('value')).toEqual('123');
        expect(inputs.at(1).prop('type')).toEqual('hidden');
        expect(inputs.at(2).prop('name')).toEqual('number');
        expect(inputs.at(2).prop('value')).toEqual(123);
        expect(inputs.at(2).prop('type')).toEqual('hidden');
    });

    test('should set the onClearHandler to the clear button onClick prop', () => {
        const wrapper = shallow(<SearchForm intl={intlShape} />).shallow();
        const lodableComponent = wrapper.find('LoadableSearchActions').shallow();
        const searchActions = lodableComponent.shallow();
        const { onClearHandler } = wrapper.instance();
        expect(searchActions.find('.clear-button').prop('onClick')).toEqual(onClearHandler);
    });

    describe('componentDidUpdate()', () => {
        test('should set isEmpty state to true when controlled input becomes empty', () => {
            const wrapper = shallow(<SearchForm intl={intlShape} value="test" />).shallow();
            wrapper.setState({ isEmpty: false });

            wrapper.setProps({ value: '' });

            expect(wrapper.state('isEmpty')).toBe(true);
        });
    });

    describe('onClearHandler()', () => {
        test('should trigger onChange with empty string', () => {
            const onChange = sandbox.spy();
            const wrapper = shallow(<SearchForm intl={intlShape} onChange={onChange} />).shallow();
            wrapper.instance().searchInput = { value: 'abc' };
            wrapper.instance().onClearHandler();
            sinon.assert.calledWith(onChange, '');
        });

        test('should set isEmpty state to true', () => {
            const wrapper = shallow(<SearchForm intl={intlShape} name="query" />).shallow();
            const instance = wrapper.instance();
            instance.setState({ isEmpty: false });
            instance.searchInput = { value: 'abc' };

            instance.onClearHandler();

            expect(wrapper.state('isEmpty')).toBe(true);
        });

        test('should stop propagation if stopDefaultEvent param is passed', () => {
            const wrapper = shallow(
                <SearchForm intl={intlShape} name="query" shouldPreventClearEventPropagation />,
            ).shallow();
            const instance = wrapper.instance();
            const stopPropagationStub = sandbox.stub();
            instance.setState({ isEmpty: false });
            instance.searchInput = { value: 'abc' };

            instance.onClearHandler({ stopPropagation: stopPropagationStub });

            expect(stopPropagationStub.calledOnce).toBe(true);
        });
    });

    describe('onChangeHandler()', () => {
        [
            {
                value: '  ',
                isEmpty: true,
            },
            {
                value: '',
                isEmpty: true,
            },
            {
                value: '  1  ',
                isEmpty: false,
            },
            {
                value: '  1  ',
                isEmpty: false,
            },
            {
                value: '123',
                isEmpty: false,
            },
            {
                value: null,
                isEmpty: true,
            },
        ].forEach(({ value, isEmpty }) => {
            test('should set isEmpty state correctly', () => {
                const wrapper = shallow(<SearchForm intl={intlShape} name="query" />).shallow();
                const instance = wrapper.instance();

                instance.onChangeHandler({
                    target: {
                        value,
                    },
                });

                expect(wrapper.state('isEmpty')).toEqual(isEmpty);
            });
        });
    });

    test('should render loading indicator and not search/clear buttons when isLoading is true', () => {
        const wrapper = mount(<SearchForm isLoading placeholder="search" />);

        expect(wrapper.find('.action-button').length).toEqual(0);
        expect(wrapper.find('.search-form-loading-indicator').hostNodes().length).toEqual(1);
    });

    test('should call getSearchInput prop when it exists', () => {
        const getSearchInputSpy = sandbox.spy();
        const searchInputMock = () => <div className="search-input" />;
        const wrapper = shallow(<SearchForm getSearchInput={getSearchInputSpy} />).shallow();

        wrapper.instance().setInputRef(searchInputMock);

        expect(getSearchInputSpy.calledOnce).toBe(true);
    });

    test('should not pass getSearchInput prop down to <input> element', () => {
        const wrapper = mount(<SearchForm getSearchInput={sandbox.stub()} />);

        const input = wrapper.find('input');

        expect(input.props().getSearchInput).toBeFalsy();
    });
});
