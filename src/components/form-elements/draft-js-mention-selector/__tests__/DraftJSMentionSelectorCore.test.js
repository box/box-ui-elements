import React from 'react';
import { mount, shallow } from 'enzyme';
import { ContentState, EditorState } from 'draft-js';
import sinon from 'sinon';

import DraftJSEditor from '../../../draft-js-editor';
import DraftJSMentionSelector from '../DraftJSMentionSelectorCore';

const sandbox = sinon.sandbox.create();

const noMentionEditorState = EditorState.createWithContent(ContentState.createFromText('No mention here'));
const oneMentionEditorState = EditorState.createWithContent(ContentState.createFromText('Hey @foo'));
const twoMentionEditorState = EditorState.createWithContent(ContentState.createFromText('Hi @foo, meet @bar'));

const oneMentionSelectionState = oneMentionEditorState.getSelection().merge({
    anchorOffset: 8,
    focusOffset: 8,
});

const twoMentionSelectionState = twoMentionEditorState.getSelection().merge({
    anchorOffset: 18,
    focusOffset: 18,
});

const twoMentionSelectionStateCursorInside = twoMentionEditorState.getSelection().merge({
    anchorOffset: 17,
    focusOffset: 17,
});

const oneMentionExpectedMention = {
    mentionString: 'foo',
    mentionTrigger: '@',
    start: 4,
    end: 8,
};

const twoMentionExpectedMention = {
    mentionString: 'bar',
    mentionTrigger: '@',
    start: 14,
    end: 18,
};

const twoMentionCursorInsideExpectedMention = {
    mentionString: 'ba',
    mentionTrigger: '@',
    start: 14,
    end: 17,
};

describe('components/form-elements/draft-js-mention-selector/DraftJSMentionSelector', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    const requiredProps = {
        editorState: EditorState.createEmpty(),
        label: 'mention selector',
    };

    describe('render()', () => {
        test('should correctly render the component', () => {
            const wrapper = mount(<DraftJSMentionSelector {...requiredProps} />);

            expect(wrapper.childAt(0).hasClass('mention-selector-wrapper')).toBe(true);

            expect(wrapper.find(DraftJSEditor).length).toBe(1);
        });

        test('should correctly render the selector dropdown', () => {
            const wrapper = shallow(<DraftJSMentionSelector {...requiredProps} />);
            const dropdown = wrapper.find('SelectorDropdown');
            expect(dropdown.length).toBe(1);
            expect(dropdown.prop('onSelect')).toEqual(wrapper.instance().handleContactSelected);
        });

        [
            // no onMention method, no focus, activeMention set, mention string empty
            {
                onMention: undefined,
                isFocused: false,
                activeMention: { foo: 'bar' },
                shouldShowMentionStartState: false,
            },
            // no focus, activeMention set, mention string empty
            {
                onMention: sandbox.stub(),
                isFocused: false,
                activeMention: { foo: 'bar' },
                shouldShowMentionStartState: false,
            },
            // focus, activeMention set, mention string empty
            {
                onMention: sandbox.stub(),
                isFocused: true,
                activeMention: { foo: 'bar' },
                shouldShowMentionStartState: true,
            },
            // focus, activeMention set, mention string not empty
            {
                onMention: sandbox.stub(),
                isFocused: true,
                activeMention: { mentionString: 'bar' },
                shouldShowMentionStartState: false,
            },
        ].forEach(({ onMention, isFocused, activeMention, shouldShowMentionStartState }) => {
            const wrapper = mount(<DraftJSMentionSelector {...requiredProps} onMention={onMention} />);

            wrapper.setState({ activeMention, isFocused });

            if (shouldShowMentionStartState) {
                test('should show MentionStartState', () => {
                    expect(wrapper.find('MentionStartState').length).toBe(1);
                });
            } else {
                test('should not show MentionStartState', () => {
                    expect(wrapper.find('MentionStartState').length).toBe(0);
                });
            }
        });
    });

    describe('shouldDisplayMentionLookup()', () => {
        const exampleMention = { mentionString: '@foo' };
        const exampleContacts = [{ id: 1, name: 'foo' }];
        [
            // activeMention and contacts set
            {
                activeMention: exampleMention,
                contacts: exampleContacts,
                expected: true,
            },
            // activeMention unset, contacts set
            {
                activeMention: null,
                contacts: exampleContacts,
                expected: false,
            },
            // activeMention set, contacts empty
            {
                activeMention: exampleMention,
                contacts: [],
                expected: false,
            },
        ].forEach(({ activeMention, contacts, expected }) => {
            const wrapper = shallow(<DraftJSMentionSelector {...requiredProps} contacts={contacts} />);
            wrapper.setState({ activeMention });

            const instance = wrapper.instance();

            if (expected) {
                test('should return true', () => {
                    expect(instance.shouldDisplayMentionLookup()).toBe(true);
                });
            } else {
                test('should return false', () => {
                    expect(instance.shouldDisplayMentionLookup()).toBe(false);
                });
            }
        });
    });

    describe('getActiveMentionForEditorState()', () => {
        const wrapper = shallow(<DraftJSMentionSelector {...requiredProps} />);

        const instance = wrapper.instance();

        // TESTS
        [
            // empty input
            {
                editorState: EditorState.createEmpty(),
            },
            // input has ne mention
            {
                editorState: noMentionEditorState,
            },
        ].forEach(({ editorState }) => {
            test('should return null', () => {
                expect(instance.getActiveMentionForEditorState(editorState)).toBeNull();
            });
        });

        [
            // one string beginning with "@"
            {
                editorState: oneMentionEditorState,
                selectionState: oneMentionSelectionState,
                expected: oneMentionExpectedMention,
            },
            // two strings beginning with "@"
            {
                editorState: twoMentionEditorState,
                selectionState: twoMentionSelectionState,
                expected: twoMentionExpectedMention,
            },
            // two strings beginning "@", cursor inside one
            {
                editorState: twoMentionEditorState,
                selectionState: twoMentionSelectionStateCursorInside,
                expected: twoMentionCursorInsideExpectedMention,
            },
        ].forEach(({ editorState, selectionState, expected }) => {
            test('should return null when cursor is not over a mention', () => {
                const selectionStateAtBeginning = editorState.getSelection().merge({
                    anchorOffset: 0,
                    focusOffset: 0,
                });

                const editorStateWithForcedSelection = EditorState.acceptSelection(
                    editorState,
                    selectionStateAtBeginning,
                );

                const result = instance.getActiveMentionForEditorState(editorStateWithForcedSelection);

                expect(result).toBeNull();
            });

            test('should return the selected mention when it is selected', () => {
                const editorStateWithForcedSelection = EditorState.acceptSelection(editorState, selectionState);

                const result = instance.getActiveMentionForEditorState(editorStateWithForcedSelection);

                Object.keys(expected).forEach(key => {
                    expect(result[key]).toEqual(expected[key]);
                });
            });
        });
    });

    describe('handleMention()', () => {
        [
            // a mention active
            {
                activeMention: { mentionString: 'bar' },
                expected: 'bar',
            },
            // no mention active
            {
                activeMention: null,
                expected: '',
            },
        ].forEach(({ activeMention, expected }) => {
            test('should call props.onMention with the appropriate string', () => {
                const wrapper = shallow(
                    <DraftJSMentionSelector {...requiredProps} onMention={sandbox.mock().withArgs(expected)} />,
                );

                wrapper.setState({ activeMention });

                const instance = wrapper.instance();

                instance.handleMention();
            });
        });
    });

    describe('handleContactSelected()', () => {
        const wrapper = shallow(
            <DraftJSMentionSelector
                {...requiredProps}
                contacts={[{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }]}
            />,
        );

        const instance = wrapper.instance();

        test('should call addMention with the appropriate contact when called', () => {
            sandbox
                .mock(instance)
                .expects('addMention')
                .withArgs({ name: 'foo' });

            instance.handleContactSelected(0);
        });

        test('should update state when called', () => {
            sandbox.stub(instance, 'addMention');

            sandbox
                .mock(instance)
                .expects('setState')
                .withArgs({ activeMention: null, isFocused: true });

            instance.handleContactSelected(0);
        });

        test('should call handleMention when called', () => {
            sandbox.stub(instance, 'addMention');

            sandbox.mock(instance).expects('handleMention');

            instance.handleContactSelected(0);
        });
    });

    describe('handleBlur()', () => {
        test('should update state and call onBlur prop when called', () => {
            const event = { uno: 1 };

            const wrapper = shallow(
                <DraftJSMentionSelector {...requiredProps} onBlur={sandbox.mock().withArgs(event)} />,
            );

            const instance = wrapper.instance();
            sandbox
                .mock(instance)
                .expects('setState')
                .withArgs({
                    isFocused: false,
                });

            instance.handleBlur(event);
        });
    });

    describe('handleFocus()', () => {
        test('should update state and call onFocus prop when called', () => {
            const event = { uno: 1 };

            const wrapper = shallow(
                <DraftJSMentionSelector {...requiredProps} onFocus={sandbox.mock().withArgs(event)} />,
            );

            const instance = wrapper.instance();
            sandbox
                .mock(instance)
                .expects('setState')
                .withArgs({
                    isFocused: true,
                });

            instance.handleFocus(event);
        });
    });

    describe('handleChange()', () => {
        const nextEditorState = { zwei: '2' };

        test('should call onChange prop and setState when called', () => {
            const activeMention = {};
            const wrapper = shallow(
                <DraftJSMentionSelector {...requiredProps} onChange={sandbox.mock().withArgs(nextEditorState)} />,
            );

            const instance = wrapper.instance();
            sandbox.stub(instance, 'getActiveMentionForEditorState').returns(activeMention);
            const setStateSpy = sandbox.spy(instance, 'setState');

            instance.handleChange(nextEditorState);
            expect(setStateSpy.calledWith({ activeMention })).toBe(true);
        });

        test('should call handleMention when called if there is an active mention', () => {
            const activeMention = { mentionString: 'foo' };
            const wrapper = shallow(
                <DraftJSMentionSelector {...requiredProps} onChange={sandbox.mock().withArgs(nextEditorState)} />,
            );

            const instance = wrapper.instance();

            sandbox.stub(instance, 'getActiveMentionForEditorState').returns(activeMention);
            sandbox.mock(instance).expects('handleMention');

            instance.handleChange(nextEditorState);
        });
    });

    describe('addMention()', () => {
        test('should null out activeMention and call handleChange with updated string (plus space) when called', () => {
            const mention = { id: 1, name: 'Fool Name' };

            const wrapper = shallow(<DraftJSMentionSelector {...requiredProps} editorState={oneMentionEditorState} />);

            wrapper.setState({
                activeMention: oneMentionExpectedMention,
            });

            const instance = wrapper.instance();
            const handleChangeMock = sandbox.mock(instance).expects('handleChange');
            const setStateSpy = sandbox.spy(instance, 'setState');

            instance.addMention(mention);
            expect(setStateSpy.calledWith({ activeMention: null })).toBe(true);

            const editorStateCall = handleChangeMock.firstCall.args[0];
            expect(editorStateCall.getCurrentContent().getPlainText()).toEqual('Hey @Fool Name ');
        });
    });

    describe('componentDidUpdate()', () => {
        test('should set active mention to null if empty contacts are passed in', () => {
            const contact = {
                id: 1,
                item: {},
                name: 'John',
                value: '867-5309',
            };
            const wrapper = shallow(<DraftJSMentionSelector {...requiredProps} contacts={[contact]} />);

            wrapper.setState({
                activeMention: oneMentionExpectedMention,
            });

            wrapper.setProps({ contacts: [] });

            expect(wrapper.state('activeMention')).toBe(null);
        });
    });
});
