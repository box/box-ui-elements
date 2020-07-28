import * as React from 'react';
import { shallow } from 'enzyme';
import AnnotationActivityLink from '../AnnotationActivityLink';
import messages from '../messages';

describe('elements/content-sidebar/ActivityFeed/annotations/AnnotationActivityLink', () => {
    const wrapperProps = {
        'data-resin-iscurrent': 'true',
        'data-resin-itemid': '123',
        'data-resin-target': 'annotationLink',
        id: '123',
        message: { ...messages.annotationActivityPageItem, values: { number: 1 } },
    };

    const getWrapper = (props = {}) => shallow(<AnnotationActivityLink {...wrapperProps} {...props} />);

    test('should correctly render annotation activity link', () => {
        const wrapper = getWrapper();

        expect(wrapper.find('PlainButton').length).toEqual(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should fire onClick when the button is clicked', () => {
        const onClickFn = jest.fn();
        const wrapper = getWrapper({ onClick: onClickFn });
        const onClick = wrapper.find('PlainButton').prop('onClick');
        const event = {
            currentTarget: {
                focus: jest.fn(),
            },
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
        };

        onClick(event);

        expect(onClickFn).toHaveBeenCalledWith('123');
        expect(event.currentTarget.focus).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
    });

    test('should stop propagation of the native mousedown event', () => {
        const wrapper = getWrapper();
        const onMouseDown = wrapper.find('PlainButton').prop('onMouseDown');
        const event = {
            currentTarget: {
                focus: jest.fn(),
            },
            nativeEvent: {
                stopImmediatePropagation: jest.fn(),
            },
        };

        onMouseDown(event);

        expect(event.nativeEvent.stopImmediatePropagation).toHaveBeenCalled();
    });

    test.each`
        isDisabled | expected
        ${false}   | ${1}
        ${true}    | ${0}
    `('should handle the mousedown event if isDisabled is $isDisabled', ({ expected, isDisabled }) => {
        const wrapper = getWrapper({ isDisabled });
        const onMouseDown = wrapper.find('PlainButton').prop('onMouseDown');
        const event = {
            currentTarget: {
                focus: jest.fn(),
            },
            nativeEvent: {
                stopImmediatePropagation: jest.fn(),
            },
        };

        onMouseDown(event);

        expect(event.nativeEvent.stopImmediatePropagation).toHaveBeenCalledTimes(expected);
    });
});
