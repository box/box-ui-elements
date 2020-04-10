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

    test('should fire onClick when link is followed', () => {
        const onClickFn = jest.fn();
        const wrapper = getWrapper({ onClick: onClickFn });
        const onClick = wrapper.prop('onClick');

        onClick();

        expect(onClickFn).toHaveBeenCalledWith('123');
    });
});
