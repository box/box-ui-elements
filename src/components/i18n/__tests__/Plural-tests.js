import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';

import Plural from '../Plural';

function Link(props) {
    return <a href={props.to}>{props.children}</a>;
}

Link.propTypes = {
    to: PropTypes.string,
    children: PropTypes.any,
};

describe('components/i18n/Plural', () => {
    test('should correctly render simple Plural', () => {
        const wrapper = mount(
            <Plural category="one">
                <span>This is the singular</span>
            </Plural>,
        );

        const span = wrapper.find('span');
        expect(span.prop('children')).toEqual('This is the singular');
    });

    test('should correctly compose simple contents', () => {
        const wrapper = mount(<Plural category="one">This is the singular</Plural>);
        const plural = wrapper.instance();
        expect(plural.getSourceString()).toEqual('This is the singular');
    });

    test('should correctly compose slightly more complex contents', () => {
        const wrapper = mount(
            <Plural category="one">
                <span className="foo">This is the singular</span>
            </Plural>,
        );

        const plural = wrapper.instance();
        expect(plural.getSourceString()).toEqual('<c0>This is the singular</c0>');
    });

    test('should correctly compose much more complex contents', () => {
        const wrapper = mount(
            <Plural category="one">
                <span className="foo">
                    This <b>is</b> the <Link to="singular.html">singular</Link>.
                </span>
            </Plural>,
        );

        const plural = wrapper.instance();
        expect(plural.getSourceString()).toEqual('<c0>This <c1>is</c1> the <c2>singular</c2>.</c0>');
    });
});
