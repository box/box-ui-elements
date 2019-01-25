import React from 'react';
import { mount, shallow } from 'enzyme';
import { ContentState, EditorState } from 'draft-js';
import sinon from 'sinon';

import DraftJSMentionSelector from '..';
import * as messages from '../../input-messages';

const sandbox = sinon.sandbox.create();

describe('bcomponents/form-elements/draft-js-mention-selector/DraftJSMentionSelector', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    const requiredProps = {
        contacts: [],
        label: 'label',
        name: 'name',
        onMention: () => {},
    };

    describe('render()', () => {
        test('should correctly render the component', () => {
            const wrapper = shallow(<DraftJSMentionSelector {...requiredProps} />);

            expect(wrapper.find('FormInput').length).toBe(1);
        });
    });

    describe('componentWillReceiveProps()', () => {
        test('should update contacts and call checkValidity when called', () => {
            const newProps = {
                contacts: [{ name: 'foo' }, { name: 'bar' }],
            };

            const wrapper = shallow(<DraftJSMentionSelector {...requiredProps} />);

            const instance = wrapper.instance();

            const setStateSpy = sandbox.spy(instance, 'setState');
            sandbox.mock(instance).expects('checkValidity');

            instance.componentWillReceiveProps(newProps);

            expect(setStateSpy.calledOnce).toBe(true);
        });
    });

    describe('getErrorFromValidityState()', () => {
        const minLength = 4;
        const maxLength = 9;
        [
            // too long optional string
            {
                str: 'foo bar baz woo',
                isRequired: false,
                expected: messages.tooLong(maxLength),
            },
            // too short optional string
            {
                str: 'foo',
                isRequired: false,
                expected: messages.tooShort(minLength),
            },
            {
                str: '',
                isRequired: true,
                expected: messages.valueMissing(),
            },
            // empty required string
            {
                str: '',
                isRequired: true,
                expected: messages.valueMissing(),
            },
            // good lemgth required string
            {
                str: 'all good',
                isRequired: true,
                expected: null,
            },
            // good length optional string
            {
                str: 'all good',
                isRequired: false,
                expected: null,
            },
        ].forEach(({ str, isRequired, expected }) => {
            test('should return the correct error state', () => {
                const editorState = EditorState.createWithContent(ContentState.createFromText(str));

                const wrapper = shallow(
                    <DraftJSMentionSelector
                        {...requiredProps}
                        editorState={editorState}
                        isRequired={isRequired}
                        minLength={minLength}
                        maxLength={maxLength}
                    />,
                );

                const instance = wrapper.instance();
                const result = instance.getErrorFromValidityState();

                expect(result).toEqual(expected);
            });
        });
    });

    describe('handleBlur()', () => {
        [
            {
                validateOnBlur: true,
            },
            {
                validateOnBlur: false,
            },
        ].forEach(({ validateOnBlur }) => {
            const wrapper = mount(<DraftJSMentionSelector {...requiredProps} validateOnBlur={validateOnBlur} />);

            const instance = wrapper.instance();

            afterEach(() => {
                instance.handleBlur({
                    relatedTarget: document.createElement('div'),
                });
            });

            if (validateOnBlur) {
                test('should call checkValidity when called', () => {
                    sandbox.mock(instance).expects('checkValidity');
                });
            } else {
                test('should not call checkValidity when called', () => {
                    sandbox
                        .mock(instance)
                        .expects('checkValidity')
                        .never();
                });
            }
        });
    });

    describe('handleChange()', () => {
        const contentStateForInternal = ContentState.createFromText('internal');
        const contentStateForExternal = ContentState.createFromText('external');

        const dummyEditorState = EditorState.createEmpty();
        [
            // internal editor state
            {
                internalEditorState: EditorState.createWithContent(contentStateForInternal),
                externalEditorState: null,
            },
            // external editor state
            {
                internalEditorState: null,
                externalEditorState: EditorState.createWithContent(contentStateForExternal),
            },
        ].forEach(({ internalEditorState, externalEditorState }) => {
            const wrapper = shallow(<DraftJSMentionSelector {...requiredProps} editorState={externalEditorState} />);

            const instance = wrapper.instance();

            test('should call onchange and checkValidity when called', () => {
                wrapper
                    .setState({
                        internalEditorState,
                    })
                    .setProps({
                        onChange: sandbox.mock().withArgs(dummyEditorState),
                    });

                sandbox.mock(instance).expects('checkValidity');

                instance.handleChange(dummyEditorState);
            });

            if (internalEditorState) {
                test('should call setState with the new EditorState', () => {
                    sandbox
                        .mock(instance)
                        .expects('setState')
                        .withArgs({
                            internalEditorState: dummyEditorState,
                        });
                    instance.handleChange(dummyEditorState);
                });
            }
        });
    });

    describe('handleValidityStateUpdateHandler()', () => {
        [
            {
                hasReceivedFirstInteraction: true,
            },
            {
                hasReceivedFirstInteraction: false,
            },
        ].forEach(({ hasReceivedFirstInteraction }) => {
            const err = 'oh no';

            const wrapper = shallow(<DraftJSMentionSelector {...requiredProps} />);

            const instance = wrapper.instance();

            beforeEach(() => {
                wrapper.setState({ hasReceivedFirstInteraction });
                sandbox.stub(instance, 'getErrorFromValidityState').returns(err);
            });

            afterEach(() => {
                instance.handleValidityStateUpdateHandler();
            });

            if (hasReceivedFirstInteraction) {
                test('should update state', () => {
                    sandbox
                        .mock(instance)
                        .expects('setState')
                        .withArgs({ error: err });
                });
            } else {
                test('should not update state', () => {
                    sandbox
                        .mock(instance)
                        .expects('setState')
                        .never();
                });
            }
        });
    });

    describe('checkValidity()', () => {
        test('should call handleValidityStateUpdateHandler when called', () => {
            const wrapper = shallow(<DraftJSMentionSelector {...requiredProps} />);

            const instance = wrapper.instance();
            sandbox.mock(instance).expects('handleValidityStateUpdateHandler');

            instance.checkValidity();
        });
    });
});
