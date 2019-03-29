import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';

import Plural from '../Plural';
import Composition from '../Composition';

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
        const composition = new Composition(span.prop('children'));

        expect(composition.compose()).toEqual('This is the singular');
    });

    test('should correctly compose simple contents', () => {
        const wrapper = mount(<Plural category="one">This is the singular</Plural>);
        const composition = new Composition(wrapper.get(0));
        expect(composition.compose()).toEqual('This is the singular');
    });

    test('should correctly compose slightly more complex contents', () => {
        const wrapper = mount(
            <Plural category="one">
                <span className="foo">This is the singular</span>
            </Plural>,
        );

        const composition = new Composition(wrapper.get(0));
        expect(composition.compose()).toEqual('This is the singular');
    });

    test('should correctly compose much more complex contents', () => {
        const wrapper = mount(
            <Plural category="one">
                <span className="foo">
                    This <b>is</b> the <Link to="singular.html">singular</Link>.
                </span>
            </Plural>,
        );

        const composition = new Composition(wrapper.get(0));
        expect(composition.compose()).toEqual('This <c0>is</c0> the <c1>singular</c1>.');
    });
});
