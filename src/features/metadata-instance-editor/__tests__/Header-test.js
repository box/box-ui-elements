import React from 'react';

import Header from '../Header';

describe('features/metadata-instance-editor/fields/Header', () => {
    test('should correctly render when not editable', () => {
        const wrapper = shallow(<Header />);
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render when editable', () => {
        const wrapper = shallow(<Header canEdit onAdd={jest.fn()} templates={['foo']} />);
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render with custom title', () => {
        const wrapper = shallow(<Header canEdit onAdd={jest.fn()} templates={['foo']} title="title" />);
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render filtered templates that are not hidden', () => {
        const wrapper = shallow(
            <Header
                canAdd
                canEdit
                editors={[]}
                onAdd={jest.fn()}
                templates={[
                    { displayName: 'visible-template', isHidden: false },
                    { displayName: 'hidden-template', isHidden: true },
                    { displayName: 'another-hidden-template', hidden: true },
                ]}
                title="title"
                usedTemplates={[]}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
