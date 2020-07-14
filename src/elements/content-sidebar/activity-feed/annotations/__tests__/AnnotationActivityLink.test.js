import * as React from 'react';
import { shallow } from 'enzyme';
import AnnotationActivityLink from '../AnnotationActivityLink';
import messages from '../messages';

describe('elements/content-sidebar/ActivityFeed/annotations/AnnotationActivityLink', () => {
    const wrapperProps = {
        id: '123',
        message: { ...messages.annotationActivityPageItem, values: { number: 1 } },
    };

    const getWrapper = (props = {}) => shallow(<AnnotationActivityLink {...wrapperProps} {...props} />);

    test('should correctly render annotation activity link', () => {
        const wrapper = getWrapper();

        expect(wrapper.find('PlainButton').length).toEqual(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should fire onMousedown when link is followed', () => {
        const onClickFn = jest.fn();
        const wrapper = getWrapper({ onClick: onClickFn });
        const onMouseDown = wrapper.find('PlainButton').prop('onMouseDown');
        const event = {
            currentTarget: {
                focus: jest.fn(),
            },
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
            nativeEvent: {
                stopImmediatePropagation: jest.fn(),
            },
        };

        onMouseDown(event);

        expect(onClickFn).toHaveBeenCalledWith('123');
        expect(event.currentTarget.focus).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(event.nativeEvent.stopImmediatePropagation).toHaveBeenCalled();
    });
});
