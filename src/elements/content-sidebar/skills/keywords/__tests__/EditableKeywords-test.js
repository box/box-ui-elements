import * as React from 'react';
import { shallow } from 'enzyme';
import EditableKeywords from '../EditableKeywords';

describe('elements/content-sidebar/Skills/Keywords/EditableKeywords', () => {
    test('should correctly render', () => {
        const props = {
            keywords: [{ text: 'foo' }, { text: 'bar' }],
            onAdd: jest.fn(),
            onDelete: jest.fn(),
            onSave: jest.fn(),
            onCancel: jest.fn(),
        };

        const wrapper = shallow(<EditableKeywords {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    describe('onKeyDown()', () => {
        test('should call onBlur when enter is pressed and is not in composition mode', () => {
            const wrapper = shallow(<EditableKeywords />);
            const instance = wrapper.instance();
            instance.onBlur = jest.fn();
            instance.onKeyDown({ key: 'Enter' });
            expect(instance.onBlur).toBeCalled();
        });
        test('should not call onBlur when in composition mode', () => {
            const wrapper = shallow(<EditableKeywords />);
            const instance = wrapper.instance();
            instance.setState({ isInCompositionMode: true });
            instance.onBlur = jest.fn();
            instance.onKeyDown({ key: 'Enter' });
            expect(instance.onBlur).not.toBeCalled();
        });
    });

    describe('Component Lifecycle', () => {
        test('should reset when new keywords are given', () => {
            const wrapper = shallow(<EditableKeywords />);

            wrapper.setState({ keyword: 'Test Case' });
            wrapper.setProps({ keywords: ['Test'] });

            expect(wrapper.state('keyword')).toEqual('');
        });
    });
});
