/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/jsx-no-comment-textnodes */
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { ContentState, EditorState, convertToRaw } from 'draft-js';
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
        beforeEach(() => {
            jest.spyOn(document, 'querySelector').mockImplementation(() => ({
                querySelector: () => ({ currentTime: 70 }),
            }));
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

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

        test('should not toggle the time stamp if timestampLabel is undefined', () => {
            const wrapper = shallow(
                <DraftJSMentionSelector {...requiredProps} isRequired={true} timestampLabel={undefined} />,
            );
            expect(wrapper.find('Toggle').length).toEqual(0);
        });

        test('should show timestamp toggle on with timestamp if timestamplabel is defined and isRequired is true', () => {
            const props = { ...requiredProps };
            const wrapper = shallow(<DraftJSMentionSelector {...props} />);
            wrapper.setProps({ ...requiredProps, timestampLabel: 'Toggle Timestamp', isRequired: true });
            const instance = wrapper.instance();
            expect(instance.state.timestampToggledOn).toEqual(true);
            expect(wrapper.find('Toggle').length).toEqual(1);
            expect(wrapper.find('Toggle').prop('isOn')).toEqual(true);
            expect(instance.state.internalEditorState.getCurrentContent().getPlainText()).toContain('00:01:10');
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

        const setupWithTimestamp = props => {
            mockOnChange = jest.fn();
            wrapper = shallow(
                <DraftJSMentionSelector
                    {...props}
                    timestampLabel="Toggle Timestamp"
                    isRequired={true}
                    onChange={mockOnChange}
                />,
            );
            instance = wrapper.instance();
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

        test('should keep timestamp prepended state when content changes but timestamp entity is still present', () => {
            const dummyEditorState = EditorState.createWithContent(ContentState.createFromText('hello'));
            // add more text to the editor state
            setupWithTimestamp({ ...requiredProps });
            expect(instance.state.timestampToggledOn).toEqual(false);
            // set the timestamp prepended state to true
            instance.toggleTimestamp(dummyEditorState, true);
            expect(instance.state.timestampToggledOn).toEqual(true);
            const editorState = instance.state.internalEditorState;
            // copy the editor state
            const newEditorStateWithTimestamp = EditorState.createWithContent(editorState.getCurrentContent());

            instance.handleChange(newEditorStateWithTimestamp);
            expect(instance.state.timestampToggledOn).toEqual(true);
        });

        test('should update timestamp prepended state to false when content changes and timestamp entity is no longer present', () => {
            const dummyEditorStateWithoutTimestamp = EditorState.createWithContent(
                ContentState.createFromText('hello'),
            );
            setupWithTimestamp({ ...requiredProps, editorState: dummyEditorStateWithoutTimestamp });
            instance.toggleTimestamp(dummyEditorStateWithoutTimestamp, true);
            // set the timestamp prepended state to true
            expect(instance.state.timestampToggledOn).toEqual(true);
            instance.handleChange(dummyEditorStateWithoutTimestamp);
            expect(instance.state.timestampToggledOn).toEqual(false);
        });

        test('should still set timestamp prepended state to false when content changes and no editor state is present', () => {
            const dummyEditorStateWithoutTimestamp = EditorState.createWithContent(
                ContentState.createFromText('hello'),
            );
            setupWithTimestamp({ ...requiredProps, editorState: dummyEditorStateWithoutTimestamp });
            instance.toggleTimestamp(dummyEditorStateWithoutTimestamp, true);
            instance.setState({ internalEditorState: null });
            instance.handleChange(dummyEditorStateWithoutTimestamp);
            expect(instance.state.timestampToggledOn).toEqual(false);
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

    describe('getVideoTimestamp()', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('should return the correct video timestamp', () => {
            jest.spyOn(document, 'querySelector').mockImplementation(() => {
                return {
                    querySelector: () => {
                        return { currentTime: 70 };
                    },
                };
            });
            const wrapper = shallow(<DraftJSMentionSelector {...requiredProps} />);
            const instance = wrapper.instance();
            expect(instance.getVideoTimestamp()).toEqual('00:01:10');
        });

        test('should return the correct videoe timestamp if it has not been started yet', () => {
            const wrapper = shallow(<DraftJSMentionSelector {...requiredProps} />);
            jest.spyOn(document, 'querySelector').mockImplementation(() => {
                return {
                    querySelector: () => {
                        return <video src="http://dummy.mp4" />;
                    },
                };
            });
            const instance = wrapper.instance();
            expect(instance.getVideoTimestamp()).toEqual('00:00:00');
        });

        test('shoudl return 00:00:00 if the video is not found', () => {
            jest.spyOn(document, 'querySelector').mockImplementation(() => {
                return {
                    querySelector: () => {
                        return null;
                    },
                };
            });
            const wrapper = shallow(<DraftJSMentionSelector {...requiredProps} />);
            const instance = wrapper.instance();
            expect(instance.getVideoTimestamp()).toEqual('00:00:00');
        });

        test('should return the correct precision of the timestamp', () => {
            jest.spyOn(document, 'querySelector').mockImplementation(() => {
                return {
                    querySelector: () => {
                        return { currentTime: 176.34 };
                    },
                };
            });
            const wrapper = shallow(<DraftJSMentionSelector {...requiredProps} />);
            const instance = wrapper.instance();
            expect(instance.getVideoTimestamp()).toEqual('00:02:56');
        });
    });
    describe('video timestamp toggle', () => {
        const getTimestampedEnableComponent = () => {
            const props = { ...requiredProps, timestampLabel: 'Toggle Timestamp', isRequired: true };
            return shallow(<DraftJSMentionSelector {...props} />);
        };

        beforeEach(() => {
            jest.spyOn(document, 'querySelector').mockImplementation(() => {
                return {
                    querySelector: () => {
                        return { currentTime: 70 };
                    },
                };
            });
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('should add timestamp to the editor state when the toggle is clicked', () => {
            const wrapper = getTimestampedEnableComponent();
            const instance = wrapper.instance();
            wrapper.find('Toggle').simulate('change', { target: { checked: true } });
            expect(instance.state.internalEditorState.getCurrentContent().getPlainText()).toContain('00:01:10');
            expect(instance.state.timestampToggledOn).toEqual(true);
        });

        test('should remove timestamp from the editor state when the toggle is clicked off', () => {
            const wrapper = getTimestampedEnableComponent();
            const instance = wrapper.instance();
            wrapper.find('Toggle').simulate('change', { target: { checked: true } });
            expect(instance.state.internalEditorState.getCurrentContent().getPlainText()).toContain('00:01:10');
            wrapper.find('Toggle').simulate('change', { target: { checked: false } });
            expect(instance.state.internalEditorState.getCurrentContent().getPlainText()).not.toContain('00:01:10');
            expect(instance.state.timestampToggledOn).toEqual(false);
        });

        test('should add timestamp to the beginning of the editor state when the toggle is clicked on', () => {
            const wrapper = getTimestampedEnableComponent();
            const instance = wrapper.instance();
            instance.setState({
                internalEditorState: EditorState.createWithContent(ContentState.createFromText('this is coool!!!')),
            });
            wrapper.find('Toggle').simulate('change', { target: { checked: true } });
            expect(instance.state.internalEditorState.getCurrentContent().getPlainText()).toContain(
                '00:01:10 this is coool!!!',
            );
        });

        test('should remove timestamp from the beginning of the editor state when the toggle is clicked off', () => {
            const wrapper = getTimestampedEnableComponent();
            const instance = wrapper.instance();
            instance.setState({
                internalEditorState: EditorState.createWithContent(ContentState.createFromText('this is coool!!!')),
            });
            wrapper.find('Toggle').simulate('change', { target: { checked: true } });
            expect(instance.state.internalEditorState.getCurrentContent().getPlainText()).toContain('00:01:10');
            wrapper.find('Toggle').simulate('change', { target: { checked: false } });
            expect(instance.state.internalEditorState.getCurrentContent().getPlainText()).toEqual('this is coool!!!');
        });

        test('should add an UNEDITABLE_TIMESTAMP_TEXT entity to the editor state when the toggle is clicked on', () => {
            const wrapper = getTimestampedEnableComponent();
            const instance = wrapper.instance();
            instance.setState({
                internalEditorState: EditorState.createWithContent(ContentState.createFromText('this is coool!!!')),
            });
            wrapper.find('Toggle').simulate('change', { target: { checked: true } });
            const rawContentState = convertToRaw(instance.state.internalEditorState.getCurrentContent());
            const entity = rawContentState.entityMap[0];
            expect(entity.type).toEqual('UNEDITABLE_TIMESTAMP_TEXT');
            expect(entity.data.timestamp).toEqual('00:01:10');
        });

        test('should remove the UNEDITABLE_TIMESTAMP_TEXT entity from the editor state when the toggle is clicked off', () => {
            const wrapper = getTimestampedEnableComponent();
            const instance = wrapper.instance();
            instance.setState({
                internalEditorState: EditorState.createWithContent(ContentState.createFromText('this is coool!!!')),
            });
            wrapper.find('Toggle').simulate('change', { target: { checked: true } });
            wrapper.find('Toggle').simulate('change', { target: { checked: false } });
            const rawContentState = convertToRaw(instance.state.internalEditorState.getCurrentContent());
            expect(rawContentState.entityMap).toEqual({});
        });

        test('decorator should recognize the UNEDITABLE_TIMESTAMP_TEXT entity', () => {
            const wrapper = getTimestampedEnableComponent();
            const instance = wrapper.instance();
            expect(instance.compositeDecorator).toBeDefined();
            expect(typeof instance.compositeDecorator.getDecorations).toBe('function');
            instance.setState({
                internalEditorState: EditorState.createWithContent(ContentState.createFromText('this is coool!!!')),
            });
            wrapper.find('Toggle').simulate('change', { target: { checked: true } });
            // Verify that the decorator strategy would match this entity
            const contentState = instance.state.internalEditorState.getCurrentContent();
            const firstBlock = contentState.getFirstBlock();
            let entityFound = false;
            firstBlock.findEntityRanges(
                character => {
                    const entityKey = character.getEntity();
                    if (
                        entityKey !== null &&
                        contentState.getEntity(entityKey).getType() === 'UNEDITABLE_TIMESTAMP_TEXT'
                    ) {
                        entityFound = true;
                        return true;
                    }
                    return false;
                },
                () => {},
            );
            expect(entityFound).toBe(true);
        });

        test('should set toggle state to off when all content is deleted from the editor and a timestamp was present', () => {
            const wrapper = getTimestampedEnableComponent();
            const instance = wrapper.instance();

            // Set up initial content with timestamp
            instance.setState({
                internalEditorState: EditorState.createWithContent(ContentState.createFromText('this is some content')),
            });

            wrapper.find('Toggle').simulate('change', { target: { checked: true } });
            expect(instance.state.timestampToggledOn).toEqual(true);

            // Simulate user deleting all content (including timestamp)
            const emptyEditorState = EditorState.createWithContent(ContentState.createFromText(''));
            instance.handleChange(emptyEditorState);

            // Verify that timestampToggledOn is set to false when content is deleted
            expect(instance.state.timestampToggledOn).toEqual(false);
            expect(wrapper.find('Toggle').prop('isOn')).toEqual(false);
        });

        test('should handle mantain content when timetamp is removed', () => {
            const wrapper = getTimestampedEnableComponent();
            const instance = wrapper.instance();

            // Set up initial content with timestamp
            instance.setState({
                internalEditorState: EditorState.createWithContent(ContentState.createFromText('this is some content')),
            });

            wrapper.find('Toggle').simulate('change', { target: { checked: true } });
            expect(instance.state.timestampToggledOn).toEqual(true);

            // Simulate user deleting part of the content but keeping some
            const partialContentEditorState = EditorState.createWithContent(
                ContentState.createFromText('some content'),
            );
            instance.handleChange(partialContentEditorState);

            // Verify that timestampToggledOn is set to false when timestamp is removed
            expect(instance.state.timestampToggledOn).toEqual(false);
            expect(wrapper.find('Toggle').prop('isOn')).toEqual(false);
        });

        test('should handle backspace deletion of timestamp by user', () => {
            const wrapper = getTimestampedEnableComponent();
            const instance = wrapper.instance();

            // Set up initial content with timestamp
            instance.setState({
                internalEditorState: EditorState.createWithContent(ContentState.createFromText('this is some content')),
            });

            wrapper.find('Toggle').simulate('change', { target: { checked: true } });
            expect(instance.state.timestampToggledOn).toEqual(true);

            // Simulate user using backspace to delete the timestamp
            // Create an editor state that represents the content after backspace deletion
            const contentAfterBackspace = ContentState.createFromText('this is some content');
            const editorStateAfterBackspace = EditorState.push(
                instance.state.internalEditorState,
                contentAfterBackspace,
                'backspace-character',
            );

            instance.handleChange(editorStateAfterBackspace);

            // Verify that timestampToggledOn is set to false when timestamp is deleted
            expect(instance.state.timestampToggledOn).toEqual(false);
            expect(wrapper.find('Toggle').prop('isOn')).toEqual(false);
        });
    });
});
