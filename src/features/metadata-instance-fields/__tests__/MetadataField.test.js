import * as React from 'react';

import MetadataField from '../MetadataField';

describe('features/metadata-instance-editor/fields/MetadataField', () => {
    const onChange = jest.fn();
    const onRemove = jest.fn();
    test('should correctly render a read only field when not editable', () => {
        const wrapper = shallow(<MetadataField dataValue="value" />);
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly not render a text field', () => {
        const wrapper = shallow(
            <MetadataField canEdit dataValue="value" isHidden onChange={onChange} onRemove={onRemove} type="string" />,
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render a text field', () => {
        const wrapper = shallow(
            <MetadataField canEdit dataValue="value" onChange={onChange} onRemove={onRemove} type="string" />,
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render an enum field', () => {
        const wrapper = shallow(
            <MetadataField canEdit dataValue="value" onChange={onChange} onRemove={onRemove} type="enum" />,
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render a date field', () => {
        const wrapper = shallow(
            <MetadataField canEdit dataValue="value" onChange={onChange} onRemove={onRemove} type="date" />,
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render a taxonomy field - for the time being, in read-only mode', () => {
        const wrapper = shallow(
            <MetadataField canEdit dataValue="value" onChange={onChange} onRemove={onRemove} type="taxonomy" />,
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render a float field', () => {
        const wrapper = shallow(
            <MetadataField canEdit dataValue="value" onChange={onChange} onRemove={onRemove} type="float" />,
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render a multi-select field', () => {
        const wrapper = shallow(
            <MetadataField canEdit dataValue={['value']} onChange={onChange} onRemove={onRemove} type="multiSelect" />,
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render an integer field', () => {
        const wrapper = shallow(
            <MetadataField canEdit dataValue="value" onChange={onChange} onRemove={onRemove} type="integer" />,
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render an inline error for an invalid field type', () => {
        const wrapper = shallow(
            <MetadataField canEdit dataValue="value" onChange={onChange} onRemove={onRemove} type="badbadbad" />,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
