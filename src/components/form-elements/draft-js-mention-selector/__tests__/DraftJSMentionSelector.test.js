import * as React from 'react';
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
        test('should toggle the time stamp if isRequired and timestampedCommentsEnabled is true', () => {
            const wrapper = shallow(
                <DraftJSMentionSelector {...requiredProps} isRequired={true} timestampLabel={'Toggle Timestamp'} />,
            );
            expect(wrapper.find('Toggle').length).toEqual(1);
        });

        test('should not toggle the time stamp if isRequired is false', () => {
            const wrapper = shallow(
                <DraftJSMentionSelector {...requiredProps} isRequired={false} timestampLabel={'Toggle Timestamp'} />,
            );
            expect(wrapper.find('Toggle').length).toEqual(0);
        });

        test('should not toggle the time stamp if timeStampLabel is undefined', () => {
            const wrapper = shallow(
                <DraftJSMentionSelector {...requiredProps} isRequired={true} timestampLabel={undefined} />,
            );
            expect(wrapper.find('Toggle').length).toEqual(0);
        });
    });

    describe('getDerivedStateFromProps()', () => {
        test('should return contacts from props', () => {
            expect(DraftJSMentionSelector.getDerivedStateFromProps({ contacts: [] })).toEqual({ contacts: [] });
        });

        test('should return null if no contacts from props', () => {
            expect(DraftJSMentionSelector.getDerivedStateFromProps({})).toEqual(null);
        });
    });

    describe('componentDidUpdate()', () => {
        let mockGetDerivedStateFromEditorState;
        let mockCheckValidityIfAllowed;
        let spySetState;

        const setupInstance = props => {
            const wrapper = shallow(<DraftJSMentionSelector {...props} />);

            const instance = wrapper.instance();

            mockGetDerivedStateFromEditorState = jest.fn();
            mockCheckValidityIfAllowed = jest.fn();
            spySetState = jest.spyOn(instance, 'setState');

            instance.getDerivedStateFromEditorState = mockGetDerivedStateFromEditorState;
            instance.checkValidityIfAllowed = mockCheckValidityIfAllowed;

            return wrapper;
        };

        test('should set new state in internal editor state mode when it changes', () => {
            const wrapper = setupInstance(requiredProps);

            mockGetDerivedStateFromEditorState.mockReturnValue({});

            wrapper.setState({
                internalEditorState: EditorState.createWithContent(ContentState.createFromText('hello')),
            });

            expect(mockGetDerivedStateFromEditorState).toHaveBeenCalled();
            expect(spySetState).toHaveBeenCalledWith({}, mockCheckValidityIfAllowed);
        });

        test('should check validity in internal editor state mode when it changes but derived state is null', () => {
            const wrapper = setupInstance(requiredProps);

            mockGetDerivedStateFromEditorState.mockReturnValue(null);

            wrapper.setState({
                internalEditorState: EditorState.createWithContent(ContentState.createFromText('hello')),
            });

            expect(mockGetDerivedStateFromEditorState).toHaveBeenCalled();
            expect(spySetState).not.toHaveBeenCalled();
        });

        test('should set new state in external editor state mode when it changes', () => {
            const initialProps = { ...requiredProps, editorState: EditorState.createEmpty() };
            const wrapper = setupInstance(initialProps);

            mockGetDerivedStateFromEditorState.mockReturnValue({});

            wrapper.setProps({
                editorState: EditorState.createWithContent(ContentState.createFromText('hello')),
            });

            expect(mockGetDerivedStateFromEditorState).toHaveBeenCalled();
            expect(spySetState).toHaveBeenCalledWith({}, mockCheckValidityIfAllowed);
        });

        test('should check validity in external editor state mode when it changes but derived state is null', () => {
            const initialProps = { ...requiredProps, editorState: EditorState.createEmpty() };
            const wrapper = setupInstance(initialProps);

            mockGetDerivedStateFromEditorState.mockReturnValue(null);

            wrapper.setProps({
                editorState: EditorState.createWithContent(ContentState.createFromText('hello')),
            });

            expect(mockGetDerivedStateFromEditorState).toHaveBeenCalled();
            expect(spySetState).not.toHaveBeenCalled();
        });

        test('should not call getDerivedStateFromEditorState in internal editor state mode if same reference', () => {
            const wrapper = setupInstance(requiredProps);
            const constantEditorState = EditorState.createWithContent(ContentState.createFromText('hello'));

            wrapper.setState({ internalEditorState: constantEditorState });
            mockGetDerivedStateFromEditorState.mockClear();
            wrapper.setState({ internalEditorState: constantEditorState });

            expect(mockGetDerivedStateFromEditorState).not.toHaveBeenCalled();
            expect(spySetState).not.toHaveBeenCalled();
        });

        test('should not call getDerivedStateFromEditorState in external editor state mode if same reference', () => {
            const constantEditorState = EditorState.createWithContent(ContentState.createFromText('hello'));
            const initialProps = { ...requiredProps, editorState: constantEditorState };
            const wrapper = setupInstance(initialProps);

            wrapper.setProps({
                editorState: constantEditorState,
            });

            expect(mockGetDerivedStateFromEditorState).not.toHaveBeenCalled();
            expect(spySetState).not.toHaveBeenCalled();
        });
    });

    describe('getDerivedStateFromEditorState', () => {
        let wrapper;
        let instance;
        let mockIsEditorStateEmpty;

        beforeEach(() => {
            wrapper = shallow(<DraftJSMentionSelector {...requiredProps} />);
            instance = wrapper.instance();
            mockIsEditorStateEmpty = jest.fn();
            instance.isEditorStateEmpty = mockIsEditorStateEmpty;
        });

        test('should return isTouched false if is new editor state', () => {
            mockIsEditorStateEmpty.mockReturnValueOnce(false).mockReturnValueOnce(true);
            expect(instance.getDerivedStateFromEditorState()).toEqual({ isTouched: false, error: null });
        });

        test('should return isTouched true if editor state is dirty', () => {
            mockIsEditorStateEmpty.mockReturnValueOnce(true).mockReturnValueOnce(false);
            expect(instance.getDerivedStateFromEditorState()).toEqual({ isTouched: true });
        });

        test('should return null if not new editor state nor dirty editor', () => {
            mockIsEditorStateEmpty.mockReturnValueOnce(true).mockReturnValueOnce(true);
            expect(instance.getDerivedStateFromEditorState()).toEqual(null);
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
                        maxLength={maxLength}
                        minLength={minLength}
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
                    sandbox.mock(instance).expects('checkValidity').never();
                });
            }
        });
    });

    describe('handleChange()', () => {
        let wrapper;
        let instance;
        let mockOnChange;
        let spySetState;

        const setup = props => {
            mockOnChange = jest.fn();

            wrapper = shallow(<DraftJSMentionSelector {...props} onChange={mockOnChange} />);
            instance = wrapper.instance();

            spySetState = jest.spyOn(instance, 'setState');
        };

        test('should call onChange and setState if internal editor state exists', () => {
            setup({ ...requiredProps });
            const dummyEditorState = EditorState.createEmpty();

            instance.handleChange(dummyEditorState);

            expect(mockOnChange).toHaveBeenCalledWith(dummyEditorState);
            expect(spySetState).toHaveBeenCalledWith({ internalEditorState: dummyEditorState });
        });

        test('should call onChange and not setState if no internal editor state exists', () => {
            const dummyEditorState = EditorState.createEmpty();
            setup({ ...requiredProps, editorState: dummyEditorState });

            instance.handleChange(dummyEditorState);

            expect(mockOnChange).toHaveBeenCalledWith(dummyEditorState);
            expect(spySetState).not.toHaveBeenCalled();
        });
    });

    describe('handleValidityStateUpdateHandler()', () => {
        [
            {
                isTouched: true,
            },
            {
                isTouched: false,
            },
        ].forEach(({ isTouched }) => {
            const err = 'oh no';

            const wrapper = shallow(<DraftJSMentionSelector {...requiredProps} />);

            const instance = wrapper.instance();

            beforeEach(() => {
                wrapper.setState({ isTouched });
                sandbox.stub(instance, 'getErrorFromValidityState').returns(err);
            });

            afterEach(() => {
                instance.handleValidityStateUpdateHandler();
            });

            if (isTouched) {
                test('should update state', () => {
                    sandbox.mock(instance).expects('setState').withArgs({ error: err });
                });
            } else {
                test('should not update state', () => {
                    sandbox.mock(instance).expects('setState').never();
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

    describe('isEditorStateEmpty', () => {
        const emptyEditorState = EditorState.createEmpty();
        const contentState = ContentState.createFromText('');
        const editorStateWithChangeType = EditorState.push(emptyEditorState, contentState, 'backspace-character');
        const nonEmptyEditorState = EditorState.createWithContent(ContentState.createFromText('hello'));

        test.each`
            testcase             | editorState                  | expectedResult
            ${'empty'}           | ${emptyEditorState}          | ${true}
            ${'not empty'}       | ${nonEmptyEditorState}       | ${false}
            ${'has change type'} | ${editorStateWithChangeType} | ${false}
        `('should return whether the editor state is empty or not: $testcase', ({ editorState, expectedResult }) => {
            const wrapper = shallow(<DraftJSMentionSelector {...requiredProps} />);
            const instance = wrapper.instance();

            expect(instance.isEditorStateEmpty(editorState)).toEqual(expectedResult);
        });
    });
});
