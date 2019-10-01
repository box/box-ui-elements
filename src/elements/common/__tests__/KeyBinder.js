import React from 'react';
import { shallow } from 'enzyme';
import KeyBinder from '../KeyBinder';

describe('KeyBinder', () => {
    let onScrollToChangeMock;
    let getEvent;
    let wrapper;

    beforeEach(() => {
        onScrollToChangeMock = jest.fn();
        wrapper = shallow(
            <KeyBinder
                id="123"
                onScrollToChange={onScrollToChangeMock}
                rowCount={10}
                items={[]}
                columnCount={10}
                scrollToRow={0}
                scrollToColumn={0}
            >
                {() => {}}
            </KeyBinder>,
        );
        getEvent = type => {
            return {
                key: type,
                stopPropagation: jest.fn(),
                preventDefault: jest.fn(),
            };
        };
    });

    test('it should update scrollToRow when props change', () => {
        wrapper.setProps({ scrollToRow: 5 });
        expect(wrapper.state('scrollToRow')).toEqual(5);
    });

    test('it should update scrollToColumn when props change', () => {
        wrapper.setProps({ scrollToColumn: 5 });
        expect(wrapper.state('scrollToColumn')).toEqual(5);
    });

    test('it should update scrollToColumn and scrollToRow when props change', () => {
        wrapper.setProps({ scrollToColumn: 5, scrollToRow: 5 });
        expect(wrapper.state('scrollToColumn')).toEqual(5);
        expect(wrapper.state('scrollToRow')).toEqual(5);
    });

    test.each`
        eventType       | scrollType          | result
        ${'ArrowUp'}    | ${'scrollToRow'}    | ${2}
        ${'ArrowDown'}  | ${'scrollToRow'}    | ${8}
        ${'ArrowLeft'}  | ${'scrollToColumn'} | ${2}
        ${'ArrowRight'} | ${'scrollToColumn'} | ${8}
    `('Arrow Handlers', ({ eventType, scrollType, result }) => {
        const event = getEvent(eventType);

        wrapper.setProps({ [`${scrollType}`]: 5 });
        wrapper.simulate('keyDown', event);
        wrapper.simulate('keyDown', event);
        wrapper.simulate('keyDown', event);
        expect(onScrollToChangeMock).toBeCalled();
        expect(wrapper.state(scrollType)).toEqual(result);
    });
});
