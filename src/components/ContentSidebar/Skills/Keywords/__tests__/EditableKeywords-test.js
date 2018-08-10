import * as React from 'react';
import { shallow } from 'enzyme';
import EditableKeywords from '../EditableKeywords';

describe('components/ContentSidebar/Skills/Keywords/EditableKeywords', () => {
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
});
