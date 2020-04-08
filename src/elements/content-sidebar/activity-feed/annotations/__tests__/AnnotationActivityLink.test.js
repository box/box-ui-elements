import * as React from 'react';
import { shallow } from 'enzyme';
import AnnotationActivityLink from '../AnnotationActivityLink';
import messages from '../messages';

describe('elements/content-sidebar/ActivityFeed/annotation/AnnotationActivity', () => {
    test('should correctly render annotation activity item', () => {
        const wrapper = shallow(
            <AnnotationActivityLink
                id="123"
                message={{ ...messages.annotationActivityPageItem, value: 1 }}
                onClick={jest.fn()}
            />,
        );

        expect(wrapper.find('PlainButton').length).toEqual(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should fire onClick when link is followed', () => {
        const onClickFn = jest.fn();
        const preventDefault = jest.fn();
        const wrapper = shallow(
            <AnnotationActivityLink
                id="123"
                message={{ ...messages.annotationActivityPageItem, value: 1 }}
                onClick={onClickFn}
            />,
        );
        wrapper.simulate('click', { preventDefault });
        expect(preventDefault).toHaveBeenCalled();
        expect(onClickFn).toHaveBeenCalledWith('123');
    });
});
