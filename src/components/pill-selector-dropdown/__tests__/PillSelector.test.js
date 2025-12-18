import React, { act } from 'react';
import { mount, shallow } from 'enzyme';
import { List, Record } from 'immutable';
import sinon from 'sinon';

import { PillSelectorBase as PillSelector } from '../PillSelector';

const sandbox = sinon.sandbox.create();

describe('components/pill-selector-dropdown/PillSelector', () => {
    const onInputStub = sandbox.stub();
    const onRemoveStub = sandbox.stub();
    const OptionRecord = Record({
        text: '',
        value: '',
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        test('should render default component', () => {
            const placeholder = 'test';
            const wrapper = shallow(
                <PillSelector onInput={onInputStub} onRemove={onRemoveStub} placeholder={placeholder} />,
            );
            const input = wrapper.find('textarea');
            const selector = wrapper.find('.bdl-PillSelector');

            expect(wrapper.find('Tooltip').exists()).toBe(true);
            expect(selector.length).toBe(1);
            expect(input.length).toBe(1);
            expect(input.prop('onInput')).toEqual(onInputStub);
            expect(input.prop('placeholder')).toEqual(placeholder);
        });

        test('should render disabled component', () => {
            const wrapper = shallow(<PillSelector disabled onInput={() => {}} onRemove={() => {}} />);

            expect(wrapper).toMatchSnapshot();
        });

        test('should render with disabled input', () => {
            const wrapper = shallow(<PillSelector isInputDisabled onInput={onInputStub} onRemove={onRemoveStub} />);
            const input = wrapper.find('textarea');

            expect(input.prop('disabled')).toBe(true);
        });

        test('should add is-focused class when input is focused', () => {
            const wrapper = shallow(<PillSelector onInput={onInputStub} onRemove={onRemoveStub} />);
            wrapper.setState({ isFocused: true });

            expect(wrapper.find('.is-focused').length).toBe(1);
        });

        test('should not add is-focused class when input is not focused', () => {
            const wrapper = shallow(<PillSelector onInput={onInputStub} onRemove={onRemoveStub} />);
            wrapper.setState({ isFocused: false });

            expect(wrapper.find('.is-focused').length).toBe(0);
        });

        test('should add bdl-PillSelector-input--nextLine class when prop is set to true', () => {
            const wrapper = shallow(
                <PillSelector onInput={onInputStub} onRemove={onRemoveStub} isInputFocusedNextLine />,
            );

            expect(wrapper.find('.bdl-PillSelector-input--nextLine').length).toBe(1);
        });

        test('should not add bdl-PillSelector-input--nextLine class when prop is not given', () => {
            const wrapper = shallow(<PillSelector onInput={onInputStub} onRemove={onRemoveStub} />);

            expect(wrapper.find('.bdl-PillSelector-input--nextLine').length).toBe(0);
        });

        test('should add show-error class when error is given', () => {
            const wrapper = shallow(<PillSelector error="hello" onInput={onInputStub} onRemove={onRemoveStub} />);

            expect(wrapper.find('.show-error').length).toBe(1);
        });

        test('should not add show-error class when error is not given', () => {
            const wrapper = shallow(<PillSelector onInput={onInputStub} onRemove={onRemoveStub} />);

            expect(wrapper.find('.show-error').length).toBe(0);
        });

        test('should render pills when there are selected options using legacy text attribute', () => {
            const options = [
                { text: 'test', value: 'test' },
                { text: 'blah', value: 'hi' },
            ];
            const wrapper = shallow(
                <PillSelector onInput={onInputStub} onRemove={onRemoveStub} selectedOptions={options} />,
            );

            expect(wrapper.find('Pill').length).toBe(2);
        });

        test('should render RoundPill instead of standard Pill when showRoundedPills prop is true', () => {
            const options = [{ text: 'test', value: 'test' }];
            const wrapper = shallow(
                <PillSelector
                    onInput={onInputStub}
                    onRemove={onRemoveStub}
                    selectedOptions={options}
                    showRoundedPills
                />,
            );

            expect(wrapper.find('RoundPill').length).toBe(1);
        });

        test('should render pills when there are selected options', () => {
            const options = [
                { displayText: 'test', value: 'test' },
                { displayText: 'blah', value: 'hi' },
            ];
            const wrapper = shallow(
                <PillSelector onInput={onInputStub} onRemove={onRemoveStub} selectedOptions={options} />,
            );

            const pills = wrapper.find('Pill');
            expect(pills.length).toBe(2);
            expect(pills.at(0).prop('isValid')).toBeTruthy();
            expect(pills.at(1).prop('isValid')).toBeTruthy();
        });

        test('should render invalid pills when validator is provided and allowInvalidPills is true', () => {
            const validator = ({ displayText }) => {
                // W3C type="email" input validation
                const pattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                return pattern.test(displayText);
            };
            const options = [
                { displayText: 'test', value: 'test' },
                { displayText: 'blah', value: 'hi' },
            ];
            const wrapper = shallow(
                <PillSelector
                    allowInvalidPills
                    onInput={onInputStub}
                    onRemove={onRemoveStub}
                    selectedOptions={options}
                    validator={validator}
                />,
            );
            const pills = wrapper.find('Pill');
            expect(pills.length).toBe(2);
            expect(pills.at(0).prop('isValid')).toBeFalsy();
            expect(pills.at(1).prop('isValid')).toBeFalsy();
        });

        test('should render round pills using the class name returned by getPillClassName', () => {
            const getPillClassName = ({ className }) => className;
            const options = [
                { displayText: 'Pill 1', value: '1', className: 'MyClass1' },
                { displayText: 'Pill 2', value: '2', className: 'MyClass2' },
                { displayText: 'Pill 3', value: '3', className: 'MyClass2' },
            ];
            const wrapper = shallow(
                <PillSelector
                    showRoundedPills
                    onInput={onInputStub}
                    onRemove={onRemoveStub}
                    selectedOptions={options}
                    getPillClassName={getPillClassName}
                />,
            );

            const pills = wrapper.find('RoundPill');
            expect(pills.at(0).prop('className')).toBe(options[0].className);
            expect(pills.at(1).prop('className')).toBe(options[1].className);
            expect(pills.at(2).prop('className')).toBe(options[2].className);
        });

        test('should render pills when selected options are immutable', () => {
            const options = new List([
                new OptionRecord({ text: 'test', value: 'test' }),
                new OptionRecord({ text: 'blah', value: 'hi' }),
            ]);
            const wrapper = shallow(
                <PillSelector onInput={onInputStub} onRemove={onRemoveStub} selectedOptions={options} />,
            );

            expect(wrapper.find('Pill').length).toBe(2);
        });

        test('should render pill as selected when selected index is set', () => {
            const options = [
                { text: 'test', value: 'test' },
                { text: 'blah', value: 'hi' },
            ];
            const wrapper = shallow(
                <PillSelector onInput={onInputStub} onRemove={onRemoveStub} selectedOptions={options} />,
            );
            act(() => {
                wrapper.setState({ selectedIndex: 0 });
            });

            expect(wrapper.find('Pill').at(0).prop('isSelected')).toBe(true);
        });

        test('should render hidden pill selection helper', () => {
            const wrapper = shallow(<PillSelector onInput={onInputStub} onRemove={onRemoveStub} />);
            const hidden = wrapper.find('[data-testid="pill-selection-helper"]');
            const instance = wrapper.instance();

            expect(hidden.length).toBe(1);
            expect(hidden.prop('onBlur')).toEqual(instance.resetSelectedIndex);
        });

        test('should render class name on input when specified', () => {
            const className = 'test';
            const wrapper = shallow(
                <PillSelector className={className} onInput={onInputStub} onRemove={onRemoveStub} />,
            );
            const input = wrapper.find('textarea');

            expect(input.hasClass('bdl-PillSelector-input')).toBe(true);
            expect(input.hasClass(className)).toBe(true);
        });

        test('should pass input props when specified', () => {
            const role = 'combobox';
            const wrapper = shallow(
                <PillSelector inputProps={{ role }} onInput={onInputStub} onRemove={onRemoveStub} />,
            );

            expect(wrapper.find('textarea').prop('role')).toEqual(role);
        });

        test('should pass through additional props when specified', () => {
            const value = 'test';
            const wrapper = shallow(
                <PillSelector onChange={() => {}} onInput={onInputStub} onRemove={onRemoveStub} value={value} />,
            );

            expect(wrapper.find('textarea').prop('value')).toEqual(value);
        });

        test('should not render placeholder when there are pills', () => {
            const options = [{ text: 'test', value: 'test' }];
            const wrapper = shallow(
                <PillSelector onInput={onInputStub} onRemove={onRemoveStub} selectedOptions={options} />,
            );

            expect(wrapper.find('textarea').prop('placeholder')).toEqual('');
        });

        test('should not render placeholder when there are immutable pills', () => {
            const options = new List([new OptionRecord({ text: 'test', value: 'test' })]);
            const wrapper = shallow(
                <PillSelector onInput={onInputStub} onRemove={onRemoveStub} selectedOptions={options} />,
            );

            expect(wrapper.find('textarea').prop('placeholder')).toEqual('');
        });
    });

    describe('onBlur', () => {
        test('should set isFocused to false when called', () => {
            const wrapper = shallow(<PillSelector onInput={onInputStub} onRemove={onRemoveStub} />);
            wrapper.setState({ isFocused: true });
            const inputWrapper = wrapper.find('.bdl-PillSelector');
            inputWrapper.simulate('blur');
            expect(wrapper.state('isFocused')).toBe(false);
        });
    });

    describe('onClick', () => {
        test('should focus input when called', () => {
            const wrapper = mount(<PillSelector onInput={onInputStub} onRemove={onRemoveStub} />);

            sandbox.mock(wrapper.find('textarea').getDOMNode()).expects('focus');

            wrapper.find('.bdl-PillSelector').simulate('click');
        });
    });

    describe('onFocus', () => {
        test('should set isFocused to true when called', () => {
            const wrapper = shallow(<PillSelector onInput={onInputStub} onRemove={onRemoveStub} />);
            const inputWrapper = wrapper.find('.bdl-PillSelector');
            inputWrapper.simulate('focus');
            expect(wrapper.state('isFocused')).toBe(true);
        });
    });

    describe('onKeyDown - Backspace', () => {
        test('should remove selected pill when backspace is pressed', () => {
            const option = { text: 'test', value: 'test' };
            const options = [option, { text: 'blah', value: 'blah' }];
            const wrapper = mount(
                <PillSelector onInput={onInputStub} onRemove={onRemoveStub} selectedOptions={options} />,
            );
            const instance = wrapper.instance();
            act(() => {
                wrapper.setState({ selectedIndex: 0 });
            });

            sandbox.mock(instance).expects('resetSelectedIndex');
            sandbox.mock(wrapper.find('textarea').getDOMNode()).expects('focus');

            wrapper.find('.bdl-PillSelector').simulate('keyDown', {
                key: 'Backspace',
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });

            expect(onRemoveStub.calledWith(option, 0)).toBe(true);
        });

        test('should not prevent default when backspace is pressed and the input has value', () => {
            const wrapper = mount(
                <PillSelector onChange={() => {}} onInput={onInputStub} onRemove={onRemoveStub} value="test" />,
            );
            wrapper.find('.bdl-PillSelector').simulate('keyDown', {
                key: 'Backspace',
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never(),
            });
        });

        test('should call onRemove() when backspace is pressed and there are pills but no input value', () => {
            const option = { text: 'test', value: 'test' };
            const options = [{ text: 'blah', value: 'blah' }, option];
            const wrapper = mount(
                <PillSelector onInput={onInputStub} onRemove={onRemoveStub} selectedOptions={options} />,
            );
            wrapper.find('.bdl-PillSelector').simulate('keyDown', {
                key: 'Backspace',
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });
            expect(onRemoveStub.calledWith(option, 1)).toBe(true);
        });

        test('should call onRemove() when backspace is pressed and there are immutable pills but no input value', () => {
            const option = new OptionRecord({ text: 'test', value: 'test' });
            const options = new List([new OptionRecord({ text: 'blah', value: 'blah' }), option]);
            const wrapper = mount(
                <PillSelector onInput={onInputStub} onRemove={onRemoveStub} selectedOptions={options} />,
            );
            wrapper.find('.bdl-PillSelector').simulate('keyDown', {
                key: 'Backspace',
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });
            expect(onRemoveStub.calledWith(option, 1)).toBe(true);
        });

        test('should not call onRemove() when backspace is pressed and there are no pills and no input value', () => {
            const wrapper = mount(<PillSelector onInput={onInputStub} onRemove={onRemoveStub} />);
            wrapper.find('.bdl-PillSelector').simulate('keyDown', {
                key: 'Backspace',
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never(),
            });
            expect(onRemoveStub.calledOnce).toBe(false);
        });
    });

    describe('onKeyDown - ArrowLeft', () => {
        test('should select previous pill when left arrow is pressed and pill is selected', () => {
            const wrapper = mount(<PillSelector onInput={onInputStub} onRemove={onRemoveStub} />);
            act(() => {
                wrapper.setState({ selectedIndex: 1 });
            });

            wrapper.find('.bdl-PillSelector').simulate('keyDown', {
                key: 'ArrowLeft',
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });

            expect(wrapper.state('selectedIndex')).toEqual(0);
        });

        test('should keep first pill selected when left arrow is pressed and first pill is selected', () => {
            const wrapper = mount(<PillSelector onInput={onInputStub} onRemove={onRemoveStub} />);
            act(() => {
                wrapper.setState({ selectedIndex: 0 });
            });

            wrapper.find('.bdl-PillSelector').simulate('keyDown', {
                key: 'ArrowLeft',
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });

            expect(wrapper.state('selectedIndex')).toEqual(0);
        });

        test('should select last pill when left arrow is pressed, input does not have value, and there are pills', () => {
            const options = [
                { text: 'test', value: 'test' },
                { text: 'blah', value: 'blah' },
            ];
            const wrapper = mount(
                <PillSelector onInput={onInputStub} onRemove={onRemoveStub} selectedOptions={options} />,
            );

            sandbox.mock(wrapper.find('[data-testid="pill-selection-helper"]').getDOMNode()).expects('focus');

            wrapper.find('.bdl-PillSelector').simulate('keyDown', {
                key: 'ArrowLeft',
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });

            expect(wrapper.state('selectedIndex')).toEqual(1);
        });

        test('should not prevent default when left arrow is pressed and the input has value', () => {
            const wrapper = mount(
                <PillSelector onChange={() => {}} onInput={onInputStub} onRemove={onRemoveStub} value="test" />,
            );
            wrapper.find('.bdl-PillSelector').simulate('keyDown', {
                key: 'ArrowLeft',
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never(),
            });
        });
    });

    describe('onKeyDown - ArrowRight', () => {
        test('should deselect last pill when right arrow is pressed and last pill is selected', () => {
            const options = [
                { text: 'test', value: 'test' },
                { text: 'blah', value: 'blah' },
            ];
            const wrapper = mount(
                <PillSelector onInput={onInputStub} onRemove={onRemoveStub} selectedOptions={options} />,
            );
            const instance = wrapper.instance();
            act(() => {
                wrapper.setState({ selectedIndex: 1 });
            });

            sandbox.mock(instance).expects('resetSelectedIndex');
            sandbox.mock(wrapper.find('textarea').getDOMNode()).expects('focus');

            wrapper.find('.bdl-PillSelector').simulate('keyDown', {
                key: 'ArrowRight',
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });
        });

        test('should select next pill when right arrow is pressed and selected pill is not last', () => {
            const options = [
                { text: 'test', value: 'test' },
                { text: 'blah', value: 'blah' },
            ];
            const wrapper = mount(
                <PillSelector onInput={onInputStub} onRemove={onRemoveStub} selectedOptions={options} />,
            );
            act(() => {
                wrapper.setState({ selectedIndex: 0 });
            });

            wrapper.find('.bdl-PillSelector').simulate('keyDown', {
                key: 'ArrowRight',
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });

            expect(wrapper.state('selectedIndex')).toEqual(1);
        });

        test('should not prevent default when right arrow is pressed and no pill is selected', () => {
            const wrapper = mount(<PillSelector onInput={onInputStub} onRemove={onRemoveStub} />);
            wrapper.find('.bdl-PillSelector').simulate('keyDown', {
                key: 'ArrowRight',
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never(),
            });
        });
    });

    describe('onRemove', () => {
        test('should call onRemove() when pill onRemove is triggered', () => {
            const option = { text: 'test', value: 'test' };
            const options = [option, { text: 'blah', value: 'blah' }];
            const wrapper = shallow(
                <PillSelector onInput={onInputStub} onRemove={onRemoveStub} selectedOptions={options} />,
            );
            wrapper.find('Pill').at(0).prop('onRemove')();
            expect(onRemoveStub.calledWith(option, 0)).toBe(true);
        });

        test('should call onRemove() when immutable pill onRemove is triggered', () => {
            const option = new OptionRecord({ text: 'test', value: 'test' });
            const options = new List([option, new OptionRecord({ text: 'blah', value: 'blah' })]);
            const wrapper = shallow(
                <PillSelector onInput={onInputStub} onRemove={onRemoveStub} selectedOptions={options} />,
            );
            wrapper.find('Pill').at(0).prop('onRemove')();
            expect(onRemoveStub.calledWith(option, 0)).toBe(true);
        });
    });

    describe('resetSelectedIndex()', () => {
        test('should reset selected index when called', () => {
            const wrapper = shallow(<PillSelector onInput={onInputStub} onRemove={onRemoveStub} />);
            const instance = wrapper.instance();
            act(() => {
                wrapper.setState({ selectedIndex: 1 });
            });

            instance.resetSelectedIndex();

            expect(wrapper.state('selectedIndex')).toEqual(-1);
        });
    });
});
