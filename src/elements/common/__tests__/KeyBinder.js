import React from 'react';
import { shallow } from 'enzyme';
import KeyBinder from '../KeyBinder';

describe('KeyBinder', () => {
    let onScrollToChangeMock;
    const getEvent = type => {
        return {
            key: type,
            stopPropagation: jest.fn(),
            preventDefault: jest.fn(),
        };
    };
    const getWrapper = props => {
        return shallow(
            <KeyBinder
                id="123"
                onScrollToChange={onScrollToChangeMock}
                rowCount={10}
                items={[]}
                columnCount={10}
                scrollToRow={0}
                scrollToColumn={0}
                {...props}
            >
                {() => {}}
            </KeyBinder>,
        );
    };

    beforeEach(() => {
        onScrollToChangeMock = jest.fn();
    });

    test('should update scrollToRow when props change', () => {
        const wrapper = getWrapper();

        wrapper.setProps({ scrollToRow: 5 });
        expect(wrapper.state('scrollToRow')).toEqual(5);
    });

    test('should update scrollToColumn when props change', () => {
        const wrapper = getWrapper();

        wrapper.setProps({ scrollToColumn: 5 });
        expect(wrapper.state('scrollToColumn')).toEqual(5);
    });

    test('should update scrollToColumn and scrollToRow when props change', () => {
        const wrapper = getWrapper();

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
    `('should exercise the $eventType key for $scrollType', ({ eventType, scrollType, result }) => {
        const event = getEvent(eventType);
        const wrapper = getWrapper({ [`${scrollType}`]: 5 });
        const instance = wrapper.instance();

        instance.onKeyDown(event);
        instance.onKeyDown(event);
        instance.onKeyDown(event);

        expect(onScrollToChangeMock).toBeCalled();
        expect(wrapper.state(scrollType)).toEqual(result);
    });
});
