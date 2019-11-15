import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';

import FormattedCompMessage from '../FormattedCompMessage';
import Param from '../Param';
import Plural from '../Plural';

jest.unmock('react-intl');

const { IntlProvider, intlShape } = jest.requireActual('react-intl');

//Create the IntlProvider to retrieve context for wrapping around.
function createIntl(locale, messages) {
    const intlProvider = new IntlProvider(locale, messages);
    const { intl } = intlProvider.getChildContext();

    return intl;
}

const intl = createIntl("en-US", {});

/**
 * When using React-Intl `injectIntl` on components, props.intl is required.
 */
function nodeWithIntlProp(intl, node) {
  return React.cloneElement(node, { intl });
}

function mountWithIntl(intl, node) {
    return mount(nodeWithIntlProp(intl, node), {
        context: { intl },
        childContextTypes: { intl: intlShape }
    });
}

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
            const wrapper = mountWithIntl(intl, <FormattedCompMessage id="test" description="asdf" defaultMessage="some text" />);

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');
            expect(span.prop('children')).toEqual('some text');
        });

        test('should correctly render FormattedCompMessage with children', () => {
            const wrapper = mountWithIntl(intl,
                <FormattedCompMessage id="test" description="asdf">
                    some text
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');
            expect(span.prop('children')).toEqual('some text');
        });

        test('should correctly render FormattedCompMessage with children snapshot', () => {
            const wrapper = mountWithIntl(intl,
                <FormattedCompMessage id="test" description="asdf">
                    some text
                </FormattedCompMessage>,
            );

            expect(wrapper).toMatchSnapshot();
        });

        test('should correctly render FormattedCompMessage with HTML', () => {
            const wrapper = mountWithIntl(intl,
                <FormattedCompMessage id="test" description="asdf">
                    some <b>bold</b> text
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');
            expect(span.prop('children')).toContain('some ');
        });

        test('should correctly render FormattedCompMessage with HTML snapshot', () => {
            const wrapper = mountWithIntl(intl,
                <FormattedCompMessage id="test" description="asdf">
                    some <b>bold</b> text
                </FormattedCompMessage>,
            );

            expect(wrapper).toMatchSnapshot();
        });

        test('should correctly render FormattedCompMessage which starts with HTML, snapshot', () => {
            const wrapper = mountWithIntl(intl,
                <FormattedCompMessage id="test" description="asdf">
                    <b>bold</b> text. More text.
                </FormattedCompMessage>,
            );

            expect(wrapper).toMatchSnapshot();
        });

        test('should correctly render FormattedCompMessage with subcomponents', () => {
            const wrapper = mountWithIntl(intl,
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

        test('should correctly render FormattedCompMessage with subcomponents snapshot', () => {
            const wrapper = mountWithIntl(intl,
                <FormattedCompMessage id="test" description="asdf">
                    some <LinkButton to="foo">link</LinkButton> text
                </FormattedCompMessage>,
            );

            expect(wrapper).toMatchSnapshot();
        });

        test('should correctly render FormattedCompMessage with simple plurals in English (singular)', () => {
            const wrapper = mountWithIntl(intl,
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
            const wrapper = mountWithIntl(intl,
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
            const ruIntl = createIntl({
                locale: 'ru-RU',
                messages: {
                    "test": "{count, plural, one {This is the singular in Russian.} other {These are the other plurals in Russian.}}"
                }
            });
            const wrapper = mountWithIntl(ruIntl,
                <FormattedCompMessage locale="ru-RU" id="test" description="asdf" count={1}>
                    <Plural category="one">This is the singular.</Plural>
                    <Plural category="other">These are the plurals.</Plural>
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');
            expect(span.prop('children')).toEqual('This is the singular in Russian.');
        });

        test('should correctly render FormattedCompMessage with simple plurals in Russian (one)', () => {
            const ruIntl = createIntl({
                locale: 'ru-RU',
                messages: {
                    "test": "{count, plural, one {This is the singular in Russian.} few {These are the few plurals in Russian.} many {These are the many plurals in Russian.} other {These are the other plurals in Russian.}}"
                }
            });
            const wrapper = mountWithIntl(ruIntl,
                <FormattedCompMessage locale="ru-RU" id="test" description="asdf" count={21}>
                    <Plural category="one">This is the singular.</Plural>
                    <Plural category="other">These are the plurals.</Plural>
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            // 21 is singular in Russian!
            expect(span.prop('children')).toEqual('This is the singular in Russian.');
        });

        test('should correctly render FormattedCompMessage with simple plurals in Russian (few)', () => {
            const ruIntl = createIntl({
                locale: 'ru-RU',
                messages: {
                    "test": "{count, plural, one {This is the singular in Russian.} few {These are the few plurals in Russian.} many {These are the many plurals in Russian.} other {These are the other plurals in Russian.}}"
                }
            });
            const wrapper = mountWithIntl(ruIntl,
                <FormattedCompMessage locale="ru-RU" id="test" description="asdf" count={24}>
                    <Plural category="one">This is the singular.</Plural>
                    <Plural category="other">These are the plurals.</Plural>
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            // 24 is few in Russian!
            expect(span.prop('children')).toEqual('These are the few plurals in Russian.');
        });

        test('should correctly render FormattedCompMessage with simple plurals in Russian (many)', () => {
            const ruIntl = createIntl({
                locale: 'ru-RU',
                messages: {
                    "test": "{count, plural, one {This is the singular in Russian.} few {These are the few plurals in Russian.} many {These are the many plurals in Russian.} other {These are the other plurals in Russian.}}"
                }
            });
            const wrapper = mountWithIntl(ruIntl,
                <FormattedCompMessage locale="ru-RU" id="test" description="asdf" count={27}>
                    <Plural category="one">This is the singular.</Plural>
                    <Plural category="other">These are the plurals.</Plural>
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            // 27 is many in Russian!
            expect(span.prop('children')).toEqual('These are the many plurals in Russian.');
        });

        test('should correctly render FormattedCompMessage with a Param subcomponent', () => {
            const wrapper = mountWithIntl(intl,
                <FormattedCompMessage locale="ru-RU" id="test" description="asdf">
                    The string is <Param value="asdf" description="asdf" />.
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            expect(span.text()).toEqual('The string is asdf.');
        });

        test('should correctly render FormattedCompMessage with multiple Param subcomponents', () => {
            const wrapper = mountWithIntl(intl,
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
            const wrapper = mountWithIntl(intl,
                <FormattedCompMessage locale="ru-RU" id="test" description="asdf">
                    The string is <Param value={str} description="foo" />.
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            expect(span.text()).toEqual('The string is a string.');
        });

        test('should correctly render FormattedCompMessage with undefined Param value', () => {
            const str = undefined;
            const wrapper = mountWithIntl(intl,
                <FormattedCompMessage locale="ru-RU" id="test" description="asdf">
                    The string is <Param value={str} description="foo" />.
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            // Should put an empty string and not "undefined" in the output.
            expect(span.text()).toEqual('The string is .');
        });

        test('should correctly render FormattedCompMessage with null Param value', () => {
            const str = null;
            const wrapper = mountWithIntl(intl,
                <FormattedCompMessage locale="ru-RU" id="test" description="asdf">
                    The string is <Param value={str} description="foo" />.
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            // Should put an empty string and not "null" in the output.
            expect(span.text()).toEqual('The string is .');
        });

        test('should correctly render FormattedCompMessage with boolean Param value', () => {
            const str = true;
            const wrapper = mountWithIntl(intl,
                <FormattedCompMessage locale="ru-RU" id="test" description="asdf">
                    The string is <Param value={str} description="foo" />.
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            // Should put an empty string and not "null" in the output.
            expect(span.text()).toEqual('The string is true.');
        });

        test('should correctly render FormattedCompMessage with numeric Param value', () => {
            const str = 123.456;
            const wrapper = mountWithIntl(intl,
                <FormattedCompMessage locale="ru-RU" id="test" description="asdf">
                    The string is <Param value={str} description="foo" />.
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            // Should put an empty string and not "null" in the output.
            expect(span.text()).toEqual('The string is 123.456.');
        });

        test('should correctly render FormattedCompMessage with functional Param value', () => {
            const str = function str() {
                return 'Hello!';
            };
            const wrapper = mountWithIntl(intl,
                <FormattedCompMessage id="test" description="asdf">
                    The string is <Param value={str} description="foo" />.
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            // Should put an empty string and not "null" in the output.
            expect(span.text()).toEqual('The string is Hello!.');
        });

        test('should correctly render FormattedCompMessage with replacement parameters within subcomponents', () => {
            const name = 'substituted';
            const wrapper = mountWithIntl(intl,
                <FormattedCompMessage id="test" description="asdf">
                    some{' '}
                    <LinkButton url="https://foo.com/a/b">
                        <Param value={name} description="foo" />
                    </LinkButton>
                    text
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            const a = wrapper.find('a');
            expect(a.text()).toContain('substituted');
        });

        test('should correctly render FormattedCompMessage with replacement parameters inside subcomponents', () => {
            const folderName = 'substituted';
            const wrapper = mountWithIntl(intl,
                <FormattedCompMessage id="test.x.y" description="asdf">
                    Settings{' '}
                    <span className="deemphasized">
                    for <Param description="Folder name" value={folderName} />
                  </span>
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span').first();
            expect(span.html()).toContain('<span x-resource-id=\"test.x.y\">Settings <span class=\"deemphasized\">for substituted</span></span>');
        });

        test('should correctly render FormattedCompMessage with replacement parameters inside subcomponents and translations', () => {
            const folderName = 'substituted';
            const translations = {
                'test.x.y': 'Einstellungen <c0> für <p0/> </c0>'
            };
            const deintl = createIntl({
                locale: 'de',
                messages: translations
            });

            const wrapper = mountWithIntl(deintl,
                <FormattedCompMessage id="test.x.y" description="asdf">
                    Settings{' '}
                    <span className="deemphasized">
                    for <Param description="Folder name" value={folderName} />
                  </span>
                </FormattedCompMessage>
            );

            const span = wrapper.find('span').first();
            expect(span.html()).toContain('<span x-resource-id=\"test.x.y\">Einstellungen <span class=\"deemphasized\"> für substituted</span></span>');
        });

        test('should correctly render FormattedCompMessage with HTML jsx replacement parameter values', () => {
            const name = <b>bold!</b>;
            const wrapper = mountWithIntl(intl,
                <FormattedCompMessage id="test" description="asdf">
                    some{' '}
                    <i>
                        <Param value={name} description="foo" />
                    </i>
                </FormattedCompMessage>,
            );

            const span = wrapper.find('span');
            expect(span.prop('x-resource-id')).toEqual('test');

            const a = wrapper.find('b');
            expect(a.text()).toContain('bold!');
        });

        test('should throw when specifying a count but no nested plurals', () => {
            function testCount() {
                mountWithIntl(intl,
                    <FormattedCompMessage id="asdf" description="asdf" count="23">
                        some <b>bold</b> text
                    </FormattedCompMessage>,
                );
            }

            expect(testCount).toThrow();
        });

        test('should throw when specifying a count but no "one" plural', () => {
            function testPlural() {
                mountWithIntl(intl,
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
                mountWithIntl(intl,
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
