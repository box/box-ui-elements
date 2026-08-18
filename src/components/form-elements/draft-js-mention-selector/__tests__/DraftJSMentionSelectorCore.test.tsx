import React, { act } from 'react';
import { mount, shallow } from 'enzyme';
import { EditorState } from 'draft-js';
import sinon from 'sinon';

import * as utils from '../utils';
import type { Mention } from '../utils';
import DraftJSEditor from '../../../draft-js-editor';
import DraftJSMentionSelector from '../DraftJSMentionSelectorCore';

const sandbox = sinon.sandbox.create();
const getInstance = (wrapper: { instance: () => React.Component }) =>
    wrapper.instance() as InstanceType<typeof DraftJSMentionSelector>;

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

            expect(wrapper.find(DraftJSEditor)).toHaveLength(1);
        });

        test('should correctly render the selector dropdown', () => {
            const wrapper = shallow(<DraftJSMentionSelector {...requiredProps} />);
            const dropdown = wrapper.find('SelectorDropdown');
            expect(dropdown).toHaveLength(1);
            expect(dropdown.prop('onSelect')).toEqual(getInstance(wrapper).handleContactSelected);
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

            act(() => {
                wrapper.setState({ activeMention, isFocused });
            });

            if (shouldShowMentionStartState) {
                test('should show MentionStartState', () => {
                    expect(wrapper.find('MentionStartState')).toHaveLength(1);
                });
            } else {
                test('should not show MentionStartState', () => {
                    expect(wrapper.find('MentionStartState')).toHaveLength(0);
                });
            }
        });
    });

    describe('should announce amount of users tagged to screenReader users', () => {
        const args = {
            editorState: EditorState.createEmpty(),
            label: 'mention selector',
            contactsLoaded: true,
        };
        const wrapper = mount(<DraftJSMentionSelector {...args} />);

        test('should show an alert', () => {
            expect(wrapper.find('[data-testid="accessibility-alert"]')).toHaveLength(1);
        });
    });

    describe('should not announce users tagged to screenReader users', () => {
        const args = {
            editorState: EditorState.createEmpty(),
            label: 'mention selector',
            contactsLoaded: false,
        };
        const wrapper = mount(<DraftJSMentionSelector {...args} />);

        test('should not render any alert', () => {
            expect(wrapper.find('[data-testid="accessibility-alert"]')).toHaveLength(0);
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

            const instance = getInstance(wrapper);

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
        test('should call getActiveMentionForEditorState from utils', () => {
            const wrapper = shallow(<DraftJSMentionSelector {...requiredProps} />);

            wrapper.setState({ mentionPattern: 'testPattern' });

            const getMentionStub = sandbox.stub(utils, 'getActiveMentionForEditorState');

            getInstance(wrapper).getActiveMentionForEditorState('testState' as unknown as EditorState);

            expect(
                getMentionStub.calledWith('testState' as unknown as EditorState, 'testPattern' as unknown as RegExp),
            ).toBe(true);
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

                const instance = getInstance(wrapper);

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

        const instance = getInstance(wrapper);

        test('should call addMention with the appropriate contact when called', () => {
            sandbox.mock(instance).expects('addMention').withArgs({ name: 'foo' });

            instance.handleContactSelected(0);
        });

        test('should update state when called', () => {
            sandbox.stub(instance, 'addMention');

            sandbox.mock(instance).expects('setState').withArgs({ activeMention: null, isFocused: true });

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

            const instance = getInstance(wrapper);
            sandbox.mock(instance).expects('setState').withArgs({
                isFocused: false,
            });

            instance.handleBlur(event as unknown as React.SyntheticEvent);
        });
    });

    describe('handleFocus()', () => {
        test('should update state and call onFocus prop when called', () => {
            const event = { uno: 1 };

            const wrapper = shallow(
                <DraftJSMentionSelector {...requiredProps} onFocus={sandbox.mock().withArgs(event)} />,
            );

            const instance = getInstance(wrapper);
            sandbox.mock(instance).expects('setState').withArgs({
                isFocused: true,
            });

            instance.handleFocus(event as unknown as React.SyntheticEvent);
        });
    });

    describe('handleChange()', () => {
        const nextEditorState = { zwei: '2' };

        test('should call onChange prop and setState when called', () => {
            const activeMention = {};
            const wrapper = shallow(
                <DraftJSMentionSelector {...requiredProps} onChange={sandbox.mock().withArgs(nextEditorState)} />,
            );

            const instance = getInstance(wrapper);
            sandbox.stub(instance, 'getActiveMentionForEditorState').returns(activeMention as unknown as Mention);
            const setStateSpy = sandbox.spy(instance, 'setState');

            instance.handleChange(nextEditorState as unknown as EditorState);
            expect(setStateSpy.calledWith({ activeMention })).toBe(true);
        });

        test('should call handleMention when called if there is an active mention', () => {
            const activeMention = { mentionString: 'foo' };
            const wrapper = shallow(
                <DraftJSMentionSelector {...requiredProps} onChange={sandbox.mock().withArgs(nextEditorState)} />,
            );

            const instance = getInstance(wrapper);

            sandbox.stub(instance, 'getActiveMentionForEditorState').returns(activeMention as unknown as Mention);
            sandbox.mock(instance).expects('handleMention');

            instance.handleChange(nextEditorState as unknown as EditorState);
        });
    });

    describe('addMention()', () => {
        test('should call addMention from utils', () => {
            const wrapper = shallow(
                <DraftJSMentionSelector {...requiredProps} editorState={'testState' as unknown as EditorState} />,
            );

            wrapper.setState({
                activeMention: 'testActiveMention',
            });

            const instance = getInstance(wrapper);
            const addMentionStub = sandbox.stub(utils, 'addMention').returns('testReturn' as unknown as EditorState);
            const setStateSpy = sandbox.spy(instance, 'setState');
            const handleChangeStub = sandbox.stub(instance, 'handleChange');

            instance.addMention('testMention' as unknown as { id: string; name: string });
            expect(
                addMentionStub.calledWith(
                    'testState' as unknown as EditorState,
                    'testActiveMention' as unknown as Mention,
                    'testMention' as unknown as { id: string; name: string },
                ),
            ).toBe(true);
            expect(setStateSpy.calledWith({ activeMention: null })).toBe(true);
            expect(handleChangeStub.calledWith('testReturn' as unknown as EditorState)).toBe(true);
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
                activeMention: {},
            });

            wrapper.setProps({ contacts: [] });

            expect(wrapper.state('activeMention')).toBeNull();
        });
    });
});
