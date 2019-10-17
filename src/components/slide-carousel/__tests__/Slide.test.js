import React from 'react';

import Slide from '../Slide';

describe('components/slide-carousel/Slide', () => {
    const defaultProps = {
        className: 'classafrass',
        children: <p>Holla die Waldfee</p>,
    };

    const getWrapper = props => shallow(<Slide {...defaultProps} {...props} />);

    test('should render a container div', () => {
        const wrapper = getWrapper();
        expect(wrapper.is('div.slide-content')).toBe(true);
    });

    test('should add the given classname to the container div', () => {
        const wrapper = getWrapper({ className: 'hallihallo' });
        expect(wrapper.hasClass('hallihallo')).toBe(true);
    });

    test('should pass children on to container', () => {
        const blahragraph = (
            <p>
                blah <b>blah</b> blah
            </p>
        );
        const wrapper = getWrapper({ children: blahragraph });
        expect(wrapper.prop('children')).toEqual(blahragraph);
    });
});
