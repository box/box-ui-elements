import React from 'react';
import { List, Record } from 'immutable';
import sinon from 'sinon';

import PillSelectorDropdown from '../PillSelectorDropdown';

const sandbox = sinon.sandbox.create();
let clock;

describe('components/pill-selector-dropdown/PillSelectorDropdown', () => {
    const onInputStub = sandbox.stub();
    const onRemoveStub = sandbox.stub();
    const onSelectStub = sandbox.stub();
    const onPillCreateStub = sandbox.stub();
    const OptionRecord = Record({
        text: '',
        value: '',
    });

    beforeEach(() => {
        clock = sinon.useFakeTimers();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
        clock.restore();
    });

    describe('render()', () => {
        test('should render selector dropdown', () => {
            const className = 'test';
            const children = 'hi';
            const wrapper = shallow(
                <PillSelectorDropdown
                    className={className}
                    onInput={onInputStub}
                    onRemove={onRemoveStub}
                    onSelect={onSelectStub}
                >
                    {children}
                </PillSelectorDropdown>,
            );
            const instance = wrapper.instance();

            expect(wrapper.is('SelectorDropdown')).toBe(true);
            expect(wrapper.hasClass('pill-selector-wrapper')).toBe(true);
            expect(wrapper.hasClass(className)).toBe(true);
            expect(wrapper.prop('onEnter')).toEqual(instance.handleEnter);
            expect(wrapper.prop('onSelect')).toEqual(instance.handleSelect);
            expect(wrapper.contains(children)).toBe(true);
        });

        test('should render pill selector', () => {
            const inputProps = { 'aria-label': 'test' };
            const onFocusStub = sandbox.stub();
            const wrapper = shallow(
                <PillSelectorDropdown
                    inputProps={inputProps}
                    onFocus={onFocusStub}
                    onInput={onInputStub}
                    onRemove={onRemoveStub}
                    onSelect={onSelectStub}
                />,
            );
            wrapper.setState({ inputValue: 'value' });
            const instance = wrapper.instance();
            const component = shallow(wrapper.prop('selector'));
            const pillSelector = component.find('PillSelector');

            expect(pillSelector.prop('onInput')).toEqual(instance.handleInput);
            expect(pillSelector.prop('onPaste')).toEqual(instance.handlePaste);
            expect(pillSelector.prop('value')).toEqual('value');
        });

        test('should render disabled pill selector', () => {
            const wrapper = shallow(
                <PillSelectorDropdown disabled onInput={() => {}} onRemove={() => {}} onSelect={() => {}} />,
            );
            wrapper.setState();

            expect(wrapper).toMatchSnapshot();
        });

        test('should call addPillsFromInput when pill selector is blurred', () => {
            const inputProps = { 'aria-label': 'test' };
            const onFocusStub = sandbox.stub();
            const wrapper = shallow(
                <PillSelectorDropdown
                    inputProps={inputProps}
                    onFocus={onFocusStub}
                    onInput={onInputStub}
                    onRemove={onRemoveStub}
                    onSelect={onSelectStub}
                />,
            );
            wrapper.setState({ inputValue: 'value' });
            const instance = wrapper.instance();
            sandbox
                .mock(instance)
                .expects('addPillsFromInput')
                .once();
            const component = shallow(wrapper.prop('selector'));
            const pillSelector = component.find('PillSelector');
            pillSelector.simulate('blur');
        });
    });

    describe('parsePills', () => {
        test('should return a formatted map of pills', () => {
            const wrapper = shallow(
                <PillSelectorDropdown onInput={onInputStub} onRemove={onRemoveStub} onSelect={onSelectStub} />,
            );
            const instance = wrapper.instance();
            wrapper.setState({ inputValue: 'value1, value2,value3' });

            const result = instance.parsePills();
            expect(result).toEqual([
                { displayText: 'value1', text: 'value1', value: 'value1' },
                { displayText: 'value2', text: 'value2', value: 'value2' },
                { displayText: 'value3', text: 'value3', value: 'value3' },
            ]);
        });

        test('should only return pills that pass validator if one is provided and allowInvalidPills is false', () => {
            const validator = text => {
                // W3C type="email" input validation
                const pattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                return pattern.test(text);
            };

            const wrapper = shallow(
                <PillSelectorDropdown
                    onInput={onInputStub}
                    onRemove={onRemoveStub}
                    onSelect={onSelectStub}
                    validator={validator}
                />,
            );
            const instance = wrapper.instance();
            wrapper.setState({
                inputValue: 'aaron@example.com, bademail,hello@gmail.com',
            });

            const result = instance.parsePills();
            expect(result).toEqual([
                { displayText: 'aaron@example.com', text: 'aaron@example.com', value: 'aaron@example.com' },
                { displayText: 'hello@gmail.com', text: 'hello@gmail.com', value: 'hello@gmail.com' },
            ]);
        });

        test('should ignore validator if one is provided but allowInvalidPills is true', () => {
            const validator = text => {
                // W3C type="email" input validation
                const pattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                return pattern.test(text);
            };

            const wrapper = shallow(
                <PillSelectorDropdown
                    allowInvalidPills
                    onInput={onInputStub}
                    onRemove={onRemoveStub}
                    onSelect={onSelectStub}
                    validator={validator}
                />,
            );
            const instance = wrapper.instance();
            wrapper.setState({
                inputValue: 'aaron@example.com, bademail, hello@gmail.com',
            });

            const result = instance.parsePills();
            expect(result).toEqual([
                { displayText: 'aaron@example.com', text: 'aaron@example.com', value: 'aaron@example.com' },
                { displayText: 'bademail', text: 'bademail', value: 'bademail' },
                { displayText: 'hello@gmail.com', text: 'hello@gmail.com', value: 'hello@gmail.com' },
            ]);
        });
    });

    describe('addPillsFromInput', () => {
        test('should not call onSelect and onPillCreate if allowCustomPills prop is not provided', () => {
            const wrapper = shallow(
                <PillSelectorDropdown
                    onInput={onInputStub}
                    onRemove={onRemoveStub}
                    onPillCreate={sandbox.mock().never()}
                    onSelect={sandbox.mock().never()}
                />,
            );
            const instance = wrapper.instance();
            wrapper.setState({ inputValue: 'value' });

            instance.addPillsFromInput();
        });

        test('should "select" each pill, create a user pill, reset inputValue, and not call props.validateForError if valid pills exist', () => {
            const pills = [
                { text: 'value1', value: 'value1' },
                { text: 'value2', value: 'value2' },
                { text: 'value3', value: 'value3' },
            ];
            const wrapper = shallow(
                <PillSelectorDropdown
                    allowCustomPills
                    onInput={sandbox
                        .mock()
                        .once()
                        .withExactArgs('')}
                    onRemove={onRemoveStub}
                    onPillCreate={sandbox
                        .mock()
                        .once()
                        .withExactArgs(pills)}
                    onSelect={sandbox
                        .mock()
                        .once()
                        .withExactArgs(pills)}
                    validateForError={sandbox.mock().never()}
                />,
            );
            const instance = wrapper.instance();

            sandbox
                .mock(instance)
                .expects('parsePills')
                .once()
                .returns(pills);

            instance.addPillsFromInput();

            expect(wrapper.state('inputValue')).toEqual('');
        });

        test('should call props.validateForError if no pills were added but input exists', () => {
            const pills = [];
            const selectedOptions = [{ text: 'a pill', value: 'pill' }];
            const wrapper = shallow(
                <PillSelectorDropdown
                    allowCustomPills
                    onInput={sandbox.mock().never()}
                    onRemove={onRemoveStub}
                    onPillCreate={sandbox.mock().never()}
                    onSelect={sandbox.mock().never()}
                    selectedOptions={selectedOptions}
                    validateForError={sandbox.mock()}
                />,
            );
            const instance = wrapper.instance();
            wrapper.setState({ inputValue: 'value1' });

            sandbox
                .mock(instance)
                .expects('parsePills')
                .once()
                .returns(pills);

            instance.addPillsFromInput();
        });

        test('should call props.validateForError if no pills were added and no options are selected', () => {
            const pills = [];
            const selectedOptions = [];
            const wrapper = shallow(
                <PillSelectorDropdown
                    allowCustomPills
                    onInput={sandbox.mock().never()}
                    onRemove={onRemoveStub}
                    onPillCreate={sandbox.mock().never()}
                    onSelect={sandbox.mock().never()}
                    selectedOptions={selectedOptions}
                    validateForError={sandbox.mock()}
                />,
            );
            const instance = wrapper.instance();
            wrapper.setState({ inputValue: '' });

            sandbox
                .mock(instance)
                .expects('parsePills')
                .once()
                .returns(pills);

            instance.addPillsFromInput();
        });

        test('should not call props.validateForError if no pills were added, input is empty, and options are selected', () => {
            const pills = [];
            const selectedOptions = [{ text: 'a pill', value: 'pill' }];
            const wrapper = shallow(
                <PillSelectorDropdown
                    allowCustomPills
                    onInput={sandbox.mock().never()}
                    onRemove={onRemoveStub}
                    onPillCreate={sandbox.mock().never()}
                    onSelect={sandbox.mock().never()}
                    selectedOptions={selectedOptions}
                    validateForError={sandbox.mock().never()}
                />,
            );
            const instance = wrapper.instance();
            wrapper.setState({ inputValue: '' });

            sandbox
                .mock(instance)
                .expects('parsePills')
                .once()
                .returns(pills);

            instance.addPillsFromInput();
        });
    });

    describe('handleInput', () => {
        test('should update inputValue state when called', () => {
            const wrapper = shallow(
                <PillSelectorDropdown onInput={onInputStub} onRemove={onRemoveStub} onSelect={onSelectStub} />,
            );
            const instance = wrapper.instance();

            instance.handleInput({ target: { value: 'test' } });

            expect(wrapper.state('inputValue')).toEqual('test');
        });

        test('should call onInput() with value when called', () => {
            const wrapper = shallow(
                <PillSelectorDropdown onInput={onInputStub} onRemove={onRemoveStub} onSelect={onSelectStub} />,
            );
            const instance = wrapper.instance();

            instance.handleInput({ target: { value: 'test' } });

            expect(onInputStub.calledWith('test', { target: { value: 'test' } })).toBe(true);
        });
    });

    describe('handleEnter()', () => {
        test('should do nothing when in composition mode', () => {
            const wrapper = shallow(<PillSelectorDropdown />);
            const instance = wrapper.instance();
            const event = { preventDefault: jest.fn() };
            instance.addPillsFromInput = jest.fn();
            instance.handleCompositionStart();
            instance.handleEnter(event);
            expect(event.preventDefault).not.toHaveBeenCalled();
            expect(instance.addPillsFromInput).not.toHaveBeenCalled();
        });

        test('should call addPillsFromInput and prevent default when called', () => {
            const wrapper = shallow(
                <PillSelectorDropdown onInput={onInputStub} onRemove={onRemoveStub} onSelect={onSelectStub} />,
            );
            const instance = wrapper.instance();

            sandbox
                .mock(instance)
                .expects('addPillsFromInput')
                .once();

            instance.handleEnter({
                preventDefault: sandbox.mock(),
            });
        });
    });

    describe('handlePaste', () => {
        test('should call addPillsFromInput', () => {
            const wrapper = shallow(
                <PillSelectorDropdown onInput={onInputStub} onRemove={onRemoveStub} onSelect={onSelectStub} />,
            );
            const instance = wrapper.instance();

            sandbox
                .mock(instance)
                .expects('addPillsFromInput')
                .once();

            instance.handlePaste();
            clock.tick(100);
        });
    });

    describe('handleSelect', () => {
        test('should call onSelect() with option and event when called', () => {
            const option = { text: 'b', value: 'b' };
            const options = [{ text: 'a', value: 'a' }, option];
            const wrapper = shallow(
                <PillSelectorDropdown
                    onInput={onInputStub}
                    onRemove={onRemoveStub}
                    onPillCreate={onPillCreateStub}
                    onSelect={onSelectStub}
                    selectorOptions={options}
                />,
            );
            const instance = wrapper.instance();
            const event = { type: 'click' };

            instance.handleSelect(1, event);

            expect(onSelectStub.calledWith([option], event)).toBe(true);
            expect(onPillCreateStub.calledWith([option])).toBe(true);
        });

        test('should call onSelect() with immutable option and event when called', () => {
            const option = new OptionRecord({ text: 'b', value: 'b' });
            const options = new List([new OptionRecord({ text: 'a', value: 'a' }), option]);
            const wrapper = shallow(
                <PillSelectorDropdown
                    onInput={onInputStub}
                    onRemove={onRemoveStub}
                    onPillCreate={onPillCreateStub}
                    onSelect={onSelectStub}
                    selectorOptions={options}
                />,
            );
            const instance = wrapper.instance();
            const event = { type: 'click' };

            instance.handleSelect(1, event);

            expect(onSelectStub.calledWith([option], event)).toBe(true);
            expect(onPillCreateStub.calledWith([option])).toBe(true);
        });

        test('should call handleInput() with empty string value when called', () => {
            const options = [{ text: 'a', value: 'a' }];
            const wrapper = shallow(
                <PillSelectorDropdown
                    onInput={onInputStub}
                    onRemove={onRemoveStub}
                    onSelect={onSelectStub}
                    selectorOptions={options}
                />,
            );
            const instance = wrapper.instance();

            sandbox
                .mock(instance)
                .expects('handleInput')
                .withArgs({ target: { value: '' } });

            instance.handleSelect(0, {});
        });
    });

    describe('handleBlur', () => {
        test('should call onBlur() and addPillsFromInput() when underlying input is blurred', () => {
            const onBlur = jest.fn();
            const wrapper = shallow(<PillSelectorDropdown onBlur={onBlur} />);
            const instance = wrapper.instance();
            const event = { type: 'blur' };

            instance.addPillsFromInput = jest.fn();
            instance.handleBlur(event);

            expect(instance.addPillsFromInput).toHaveBeenCalled();
            expect(onBlur).toHaveBeenCalled();
        });
    });

    describe('handleCompositionStart()', () => {
        test('should set composition mode', () => {
            const wrapper = shallow(<PillSelectorDropdown />);
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.handleCompositionStart();
            expect(instance.setState).toHaveBeenCalledWith({ isInCompositionMode: true });
        });
    });

    describe('handleCompositionEnd()', () => {
        test('should unset composition mode', () => {
            const wrapper = shallow(<PillSelectorDropdown />);
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.handleCompositionEnd();
            expect(instance.setState).toHaveBeenCalledWith({ isInCompositionMode: false });
        });
    });
});
