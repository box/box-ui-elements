import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';

import FormattedCompMessage from '../FormattedCompMessage';
import Param from '../Param';
import Plural from '../Plural';

function LinkButton(props) {
    return (
        <a className="btn" href={props.to}>
            {props.children}
        </a>
    );
}

LinkButton.propTypes = {
    to: PropTypes.string,
    children: PropTypes.any,
};

describe('components/i18n', () => {
    describe('components/i18n/FormattedCompMessage', () => {
        test('should correctly render simple FormattedCompMessage', () => {
            const wrapper = mount(<FormattedCompMessage id="test" description="asdf" defaultMessage="some text" />);

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');
            expect(span.prop('children')).toEqual('some text');
        });

        test('should correctly render FormattedCompMessage with children', () => {
            const wrapper = mount(
                <FormattedCompMessage id="test" description="asdf">
                    some text
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');
            expect(span.prop('children')).toEqual('some text');
        });

        test('should correctly render FormattedCompMessage with HTML', () => {
            const wrapper = mount(
                <FormattedCompMessage id="test" description="asdf">
                    some <b>bold</b> text
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');
            expect(span.prop('children')).toContain('some ');
        });

        test('should correctly render FormattedCompMessage with subcomponents', () => {
            const wrapper = mount(
                <FormattedCompMessage id="test" description="asdf">
                    some <LinkButton to="foo">link</LinkButton> text
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');
            expect(span.prop('children')).toContain('some ');
            expect(span.prop('children')).toContain(' text');

            expect(wrapper.find('a').hasClass('btn')).toBe(true);
            expect(wrapper.find('a').prop('children')).toEqual('link');
            expect(wrapper.find('a').prop('href')).toEqual('foo');
        });

        test('should correctly render FormattedCompMessage with string replacement parameters', () => {
            const wrapper = mount(
                <FormattedCompMessage id="test" description="asdf" values={{ name: 'substituted' }}>
                    some [[name]] text
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');
            expect(span.prop('children')).toContain('some substituted text');
        });

        test('should correctly render FormattedCompMessage with multiple string replacement parameters', () => {
            const wrapper = mount(
                <FormattedCompMessage
                    id="test"
                    description="asdf"
                    values={{
                        name: 'substituted',
                        text: 'text',
                        user: 'James Earl Jones',
                    }}
                >
                    some [[name]] [[text]] from user [[user]]
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');
            expect(span.prop('children')).toContain('some substituted text from user James Earl Jones');
        });

        test('should correctly render FormattedCompMessage with empty string replacement parameters', () => {
            const wrapper = mount(
                <FormattedCompMessage id="test" description="asdf" values={{ name: '' }}>
                    some [[name]] text
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');
            expect(span.prop('children')).toContain('some  text');
        });

        test('should correctly render FormattedCompMessage with no values', () => {
            const wrapper = mount(
                <FormattedCompMessage id="test" description="asdf">
                    some [[name]] text
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');
            expect(span.prop('children')).toContain('some [[name]] text');
        });

        test('should correctly render FormattedCompMessage with values, but no string replacement parameters', () => {
            const wrapper = mount(
                <FormattedCompMessage id="test" description="asdf" values={{ name: 'substituted' }}>
                    some sorta text
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');
            expect(span.prop('children')).toContain('some sorta text');
        });

        test('should correctly render FormattedCompMessage with incorrect syntax for string replacement parameters', () => {
            const wrapper = mount(
                <FormattedCompMessage
                    id="test"
                    description="asdf"
                    values={{
                        name: 'substituted',
                        text: 'asdf',
                    }}
                >
                    some [name] [ [text]]
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');
            expect(span.prop('children')).toContain('some [name] [ [text]]');
        });

        test('should correctly render FormattedCompMessage with replacement parameters within subcomponents', () => {
            const wrapper = mount(
                <FormattedCompMessage id="test" description="asdf" values={{ name: 'substituted' }}>
                    some <LinkButton url="https://foo.com/a/b">[[name]]</LinkButton>
                    text
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            const a = wrapper.find('a');
            expect(a.prop('children')).toContain('substituted');
        });

        test('should correctly render FormattedCompMessage with missing replacement parameter values ', () => {
            const wrapper = mount(
                <FormattedCompMessage id="test" description="asdf" values={{ name: 'substituted' }}>
                    some
                    <b>[[george]]</b>
                    text [[gertrude]]
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');
            expect(span.prop('children')).toContain('text [[gertrude]]');

            const a = wrapper.find('b');
            expect(a.prop('children')).toContain('[[george]]');
        });

        test('should correctly render FormattedCompMessage with HTML jsx replacement parameter values', () => {
            const wrapper = mount(
                <FormattedCompMessage id="test" description="asdf" values={{ name: <b>bold!</b> }}>
                    some <i>[[name]]</i>
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            const a = wrapper.find('b');
            expect(a.prop('children')).toContain('bold!');
        });

        test('should correctly render FormattedCompMessage with component jsx replacement parameter values', () => {
            const wrapper = mount(
                <FormattedCompMessage
                    id="test"
                    description="asdf"
                    values={{ name: <LinkButton url="foo">bold!</LinkButton> }}
                >
                    some <i>[[name]]</i>
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            const a = wrapper.find('a');
            expect(a.prop('children')).toContain('bold!');
        });

        test('should correctly render FormattedCompMessage with functional replacement parameter values', () => {
            const wrapper = mount(
                <FormattedCompMessage
                    id="test"
                    description="asdf"
                    values={{
                        area() {
                            const x = 2;
                            return x * x * Math.PI;
                        },
                    }}
                >
                    some <b>[[area]]</b>
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            const a = wrapper.find('b');
            expect(a.prop('children')).toContain('12.566370614359172');
        });

        test('should correctly render FormattedCompMessage with numeric replacement parameter values', () => {
            const wrapper = mount(
                <FormattedCompMessage id="test" description="asdf" values={{ area: 5.34 }}>
                    some <b>[[area]]</b>
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            const a = wrapper.find('b');
            expect(a.prop('children')).toContain('5.34');
        });

        test('should correctly render FormattedCompMessage with numeric replacement parameter with value zero', () => {
            const wrapper = mount(
                <FormattedCompMessage id="test" description="asdf" values={{ area: 0 }}>
                    some <b>[[area]]</b>
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            const a = wrapper.find('b');
            expect(a.prop('children')).toContain('0');
        });

        test('should correctly render FormattedCompMessage with boolean replacement parameter values true', () => {
            const wrapper = mount(
                <FormattedCompMessage id="test" description="asdf" values={{ area: true }}>
                    some <b>[[area]]</b>
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            const a = wrapper.find('b');
            expect(a.prop('children')).toContain('true');
        });

        test('should correctly render FormattedCompMessage with boolean replacement parameter values false', () => {
            const wrapper = mount(
                <FormattedCompMessage id="test" description="asdf" values={{ area: false }}>
                    some <b>[[area]]</b>
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            const a = wrapper.find('b');
            expect(a.prop('children')).toContain('false');
        });

        test('should correctly render FormattedCompMessage with null replacement parameter values ', () => {
            const wrapper = mount(
                <FormattedCompMessage id="test" description="asdf" values={{ area: null }}>
                    some <b>[[area]]</b>
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            // should not replace the parameters with anything
            const a = wrapper.find('b');
            expect(a.prop('children')).toContain('[[area]]');
        });

        test('should correctly render FormattedCompMessage with undefined replacement parameter values ', () => {
            const wrapper = mount(
                <FormattedCompMessage id="test" description="asdf" values={{ area: undefined }}>
                    some <b>[[area]]</b>
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            // should not replace the parameters with anything
            const a = wrapper.find('b');
            expect(a.prop('children')).toContain('[[area]]');
        });

        test('should correctly render FormattedCompMessage with simple plurals in English (singular)', () => {
            const wrapper = mount(
                <FormattedCompMessage id="test" description="asdf" count={1}>
                    <Plural category="one">This is the singular.</Plural>
                    <Plural category="other">These are the plurals.</Plural>
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');
            expect(span.prop('children')).toEqual('This is the singular.');
        });

        test('should correctly render FormattedCompMessage with simple plurals in English (plural)', () => {
            const wrapper = mount(
                <FormattedCompMessage id="test" description="asdf" count={21}>
                    <Plural category="one">This is the singular.</Plural>
                    <Plural category="other">These are the plurals.</Plural>
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');
            expect(span.prop('children')).toEqual('These are the plurals.');
        });

        test('should correctly render FormattedCompMessage with simple plurals in Russian (singular)', () => {
            const wrapper = mount(
                <FormattedCompMessage locale="ru-RU" id="test" description="asdf" count={1}>
                    <Plural category="one">This is the singular.</Plural>
                    <Plural category="other">These are the plurals.</Plural>
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');
            expect(span.prop('children')).toEqual('This is the singular.');
        });

        test('should correctly render FormattedCompMessage with simple plurals in Russian (one)', () => {
            const wrapper = mount(
                <FormattedCompMessage locale="ru-RU" id="test" description="asdf" count={21}>
                    <Plural category="one">This is the singular.</Plural>
                    <Plural category="few">These are the few plurals.</Plural>
                    <Plural category="many">These are the many plurals.</Plural>
                    <Plural category="other">These are the other plurals.</Plural>
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            // 21 is singular in Russian!
            expect(span.prop('children')).toEqual('This is the singular.');
        });

        test('should correctly render FormattedCompMessage with simple plurals in Russian (few)', () => {
            const wrapper = mount(
                <FormattedCompMessage locale="ru-RU" id="test" description="asdf" count={24}>
                    <Plural category="one">This is the singular.</Plural>
                    <Plural category="few">These are the few plurals.</Plural>
                    <Plural category="many">These are the many plurals.</Plural>
                    <Plural category="other">These are the other plurals.</Plural>
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            // 24 is few in Russian!
            expect(span.prop('children')).toEqual('These are the few plurals.');
        });

        test('should correctly render FormattedCompMessage with simple plurals in Russian (many)', () => {
            const wrapper = mount(
                <FormattedCompMessage locale="ru-RU" id="test" description="asdf" count={27}>
                    <Plural category="one">This is the singular.</Plural>
                    <Plural category="few">These are the few plurals.</Plural>
                    <Plural category="many">These are the many plurals.</Plural>
                    <Plural category="other">These are the other plurals.</Plural>
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            // 27 is many in Russian!
            expect(span.prop('children')).toEqual('These are the many plurals.');
        });

        test('should correctly render FormattedCompMessage with a Param subcomponent', () => {
            const wrapper = mount(
                <FormattedCompMessage locale="ru-RU" id="test" description="asdf">
                    The string is <Param value="asdf" description="asdf" />.
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            expect(span.text()).toEqual('The string is asdf.');
        });

        test('should correctly render FormattedCompMessage with multiple Param subcomponents', () => {
            const wrapper = mount(
                <FormattedCompMessage locale="ru-RU" id="test" description="asdf">
                    The string is <Param value="asdf" description="foo" /> and the number is{' '}
                    <Param value={3} description="bar" />.
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            expect(span.text()).toEqual('The string is asdf and the number is 3.');
        });

        test('should correctly render FormattedCompMessage with a Param subcomponent that has its own value', () => {
            const str = 'a string';
            const wrapper = mount(
                <FormattedCompMessage locale="ru-RU" id="test" description="asdf">
                    The string is <Param value={str} description="foo" />.
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            expect(span.text()).toEqual('The string is a string.');
        });

        /*
    test('should correctly render FormattedCompMessage with actual translations available', () => {
        const messages = {
            test: {
                id: 'test',
                description: 'asdf',
                messages: 'Mittens <c0>[[area]]</c0>',
            },
        };
        /*
        const wrapper = mount(
            <IntlProvider locale="de-DE" messages={messages}>
                <FormattedCompMessage id="test" description="asdf" values={{ area: "Berlin" }}>
                    Downtown <b>[[area]]</b>
                </FormattedCompMessage>
            </IntlProvider>,
        );


        const wrapper = render(
            <IntlProvider locale="de-DE" messages={messages}>
                <span id="foo">This is a test</span>
            </IntlProvider>,
        );

        let span = wrapper.find('span');
        expect(span.prop('x-resource-id')).toEqual('test');
        expect(span.prop('children')).toContain('Mittens ');

        let a = wrapper.find('b');
        expect(a.prop('children')).toContain('Berlin');
    });

    test('should correctly render FormattedCompMessage with translations', () => {
        const wrapper = mount(
            <FormattedCompMessage localeid="test" description="asdf">
                some <b>bold</b> text
            </FormattedCompMessage>,
        );

        let span = wrapper.find('span');
        expect(span.prop('x-resource-id')).toEqual('test');
        expect(span.prop('children')).toContain('etwas ');
        expect(span.prop('children')).toContain(' Texte');
    });
    */

        test('should throw when missing the id', () => {
            try {
                expect(() => {
                    mount(
                        <FormattedCompMessage description="asdf">
                            some <b>bold</b> text
                        </FormattedCompMessage>,
                    );
                }).toThrow();
            } catch (e) {
                // ignore
            }
        });

        test('should throw when missing the description', () => {
            function testDescription() {
                mount(
                    <FormattedCompMessage id="asdf">
                        some <b>bold</b> text
                    </FormattedCompMessage>,
                );
            }
            expect(testDescription).toThrow();
        });

        test('should throw when specifying a count but no nested plurals', () => {
            function testCount() {
                mount(
                    <FormattedCompMessage id="asdf" description="asdf" count="23">
                        some <b>bold</b> text
                    </FormattedCompMessage>,
                );
            }

            expect(testCount).toThrow();
        });

        test('should throw when specifying a count but no "one" plural', () => {
            function testPlural() {
                mount(
                    <FormattedCompMessage id="asdf" description="asdf" count="23">
                        <Plural category="other">
                            some <b>bold</b> text
                        </Plural>
                    </FormattedCompMessage>,
                );
            }

            expect(testPlural).toThrow();
        });

        test('should throw when specifying a count but no "other" plural', () => {
            function testPlural() {
                mount(
                    <FormattedCompMessage id="asdf" description="asdf" count="23">
                        <Plural category="one">
                            some <b>bold</b> text
                        </Plural>
                    </FormattedCompMessage>,
                );
            }

            expect(testPlural).toThrow();
        });
    });
});
