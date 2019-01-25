import React from 'react';

import Field from '../Field';

describe('features/metadata-instance-editor/fields/Field', () => {
    const onChange = jest.fn();
    const onRemove = jest.fn();
    test('should correctly render a read only field when not editable', () => {
        const wrapper = shallow(<Field dataValue="value" />);
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly not render a text field', () => {
        const wrapper = shallow(
            <Field canEdit isHidden type="string" dataValue="value" onChange={onChange} onRemove={onRemove} />,
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render a text field', () => {
        const wrapper = shallow(
            <Field canEdit type="string" dataValue="value" onChange={onChange} onRemove={onRemove} />,
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render an enum field', () => {
        const wrapper = shallow(
            <Field canEdit type="enum" dataValue="value" onChange={onChange} onRemove={onRemove} />,
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render a date field', () => {
        const wrapper = shallow(
            <Field canEdit type="date" dataValue="value" onChange={onChange} onRemove={onRemove} />,
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render a float field', () => {
        const wrapper = shallow(
            <Field canEdit type="float" dataValue="value" onChange={onChange} onRemove={onRemove} />,
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render a multi-select field', () => {
        const wrapper = shallow(
            <Field canEdit type="multiSelect" dataValue={['value']} onChange={onChange} onRemove={onRemove} />,
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render an integer field', () => {
        const wrapper = shallow(
            <Field canEdit type="integer" dataValue="value" onChange={onChange} onRemove={onRemove} />,
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render an inline error for an invalid field type', () => {
        const wrapper = shallow(
            <Field canEdit type="badbadbad" dataValue="value" onChange={onChange} onRemove={onRemove} />,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
