import * as React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { Editor, EditorState } from 'draft-js';

import DraftJSEditor from '..';

const sandbox = sinon.sandbox.create();

describe('components/draft-js-editor/DraftJSEditor', () => {
    const requiredProps = {
        editorState: EditorState.createEmpty(),
        label: 'Label text',
        description: 'talesss',
        onBlur: jest.fn(),
        onChange: sandbox.stub(),
        onFocus: jest.fn(),
    } as const;

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        test('should correctly render the component', () => {
            const wrapper = shallow(<DraftJSEditor {...requiredProps} />);
            const tooltip = wrapper.find('Tooltip');
            expect(wrapper.hasClass('draft-js-editor')).toBe(true);
            expect(tooltip.length).toBe(1);
            expect(tooltip.children().is('div')).toBe(true);
            expect(wrapper.find(Editor).length).toBe(1);
        });

        test('should hide label when specified', () => {
            const wrapper = shallow(<DraftJSEditor {...requiredProps} hideLabel />);

            expect(wrapper.find('.bdl-Label').hasClass('accessibility-hidden')).toBe(true);
        });

        test('should render optional message', () => {
            const wrapper = shallow(<DraftJSEditor {...requiredProps} isRequired={false} />);

            expect(wrapper.find('OptionalFormattedMessage').exists()).toBe(true);
        });

        test('should set description when specified', () => {
            const wrapper = shallow(<DraftJSEditor {...requiredProps} />);

            expect(wrapper.find('.screenreader-description').text()).toEqual(requiredProps.description);
        });

        test('should call handleChange when <Editor /> onchange called', () => {
            const wrapper = shallow(<DraftJSEditor {...requiredProps} />);

            const instance = wrapper.instance();
            sandbox.mock(instance).expects('handleChange');
            wrapper.setProps({});

            const editor = wrapper.find(Editor);
            const onChange = editor.prop('onChange') as () => void;
            onChange();
        });

        test('should render with a11y props when inputProps is passed in', () => {
            const inputProps = {
                'aria-activedescendant': 'active',
                'aria-autocomplete': 'list',
                'aria-expanded': true,
                'aria-owns': 'id',
                role: 'textbox',
            } as const;
            const wrapper = shallow(<DraftJSEditor {...requiredProps} inputProps={inputProps} />);

            const editor = wrapper.find(Editor);
            expect(editor.prop('ariaActiveDescendantID')).toEqual(inputProps['aria-activedescendant']);
            expect(editor.prop('ariaAutoComplete')).toEqual(inputProps['aria-autocomplete']);
            expect(editor.prop('ariaExpanded')).toEqual(inputProps['aria-expanded']);
            expect(editor.prop('ariaOwneeID')).toEqual(inputProps['aria-owns']);
            expect(editor.prop('role')).toEqual('textbox');
        });
    });

    describe('handleChange()', () => {
        test('should call passed-in onChange handler when called', () => {
            const wrapper = shallow<InstanceType<typeof DraftJSEditor>>(
                <DraftJSEditor {...requiredProps} onChange={sandbox.mock()} />,
            );

            const instance = wrapper.instance();
            instance.handleChange(requiredProps.editorState);
        });
    });

    describe('handleReturn()', () => {
        const returnKeyEvent = { key: 'Enter' } as unknown as React.KeyboardEvent;
        [
            {
                isReturnHandled: true,
            },
            {
                isReturnHandled: false,
            },
        ].forEach(({ isReturnHandled }) => {
            const wrapper = shallow<InstanceType<typeof DraftJSEditor>>(
                <DraftJSEditor
                    {...requiredProps}
                    onReturn={sandbox.stub().withArgs(returnKeyEvent).returns(isReturnHandled)}
                />,
            );

            const instance = wrapper.instance();
            const handleResult = instance.handleReturn(returnKeyEvent);
            expect(handleResult).toEqual(isReturnHandled ? 'handled' : 'not-handled');
        });

        test('should return <not-handled> if onReturn prop is not set', () => {
            const wrapper = shallow<InstanceType<typeof DraftJSEditor>>(<DraftJSEditor {...requiredProps} />);

            const instance = wrapper.instance();
            const handleResult = instance.handleReturn(returnKeyEvent);
            expect(handleResult).toEqual('not-handled');
        });
    });
});
