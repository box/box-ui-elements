// @flow
import * as React from 'react';

import {
    FIELD_TYPE_STRING,
    FIELD_TYPE_DATE,
    FIELD_TYPE_FLOAT,
    FIELD_TYPE_ENUM,
} from '../../metadata-instance-editor/constants';

import { BaseFilterItem as FilterItem } from '../components/FilterItem';

describe('feature/metadata-view/FilterItem', () => {
    const getWrapper = (props = {}) => {
        const template = {
            id: 'template1',
            templateKey: 'template1',
            displayName: 'template1 title',
            scope: 'enterprise_123',
            'Vendor Name': {
                operators: ['is', 'is greater than', 'is less than', 'is not', 'is blank', 'matches any'],
                values: ['Google', 'Apple', 'Facebook'],
            },
            'Expiration Month': {
                operators: ['is', 'is greater than', 'is less than', 'is not'],
                values: ['August 2018', 'September 2018', 'October 2018'],
            },
            'File Type': {
                operators: ['is', 'is not'],
                values: ['.docx', '.mp3', 'mp4'],
            },
            fields: [
                {
                    id: 'field1',
                    type: FIELD_TYPE_STRING,
                    key: 'name',
                    displayName: 'Name',
                },
                {
                    id: 'field7',
                    type: FIELD_TYPE_DATE,
                    key: 'lastModified',
                    displayName: 'Last Modified',
                },
                {
                    id: 'field11',
                    type: FIELD_TYPE_FLOAT,
                    key: 'size',
                    displayName: 'Size',
                    description: 'example of an integer field',
                },
                {
                    id: 'field5',
                    type: FIELD_TYPE_ENUM,
                    key: 'contractValue',
                    displayName: 'Contract Value',
                    options: [{ key: '$100' }, { key: '$2000' }, { key: '$10000' }, { key: '$200000' }],
                },
            ],
        };

        const condition = {
            conditionId: 0,
            attributeDisplayText: '',
            attributeKey: null,
            operatorDisplayText: '',
            operatorKey: null,
            valueDisplayText: '',
            valueKey: null,
            valueType: '',
        };

        return shallow(
            <FilterItem
                index={0}
                template={template}
                condition={condition}
                deleteCondition={() => {}}
                update={() => {}}
                intl={{ formatMessage: () => {} }}
                {...props}
            />,
        );
    };

    describe('render()', () => {
        test('should render FilterItem', () => {
            const wrapper = getWrapper();

            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('updateSelectedField()', () => {
        [
            {
                description: 'should set selectedAttribute',
                fieldType: 'attribute',
                selectedOptionType: 'selectedAttribute',
                option: {
                    value: 0,
                    displayText: 'Vendor Name',
                },
            },
            {
                description: 'should set selectedOperator',
                fieldType: 'operator',
                selectedOptionType: 'selectedOperator',
                option: {
                    value: 0,
                    displayText: 'is greater than',
                },
            },
            {
                description: 'should set selectedValue',
                fieldType: 'value',
                selectedOptionType: 'selectedValue',
                option: {
                    value: 0,
                    displayText: 'Facebook',
                },
            },
        ].forEach(({ description, fieldType, option, selectedOptionType }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                wrapper.instance().updateSelectedField(option, fieldType);

                expect(wrapper.state(selectedOptionType)).toEqual(option.value);
            });
        });
    });

    describe('updateValueField()', () => {
        [
            {
                description: 'should set selected value to empty string',
                fieldValue: {
                    target: {
                        value: '',
                    },
                },
                result: '',
            },
            {
                description: 'should set selected value to date',
                fieldValue: new Date(2018, 11, 24, 10, 33, 30, 0),
                result: new Date(2018, 11, 24, 10, 33, 30, 0),
            },
        ].forEach(({ description, fieldValue, result }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                wrapper.instance().updateValueField(fieldValue);

                expect(wrapper.state('selectedValue')).toEqual(result);
            });
        });
    });

    describe('shouldDisplayErrorMessage()', () => {
        [
            {
                description: 'should display error message if selectedValue is not a number and valueType is a float',
                valueType: 'float',
                selectedValue: 'hello',
                result: true,
            },
            {
                description: 'should not display error message if selectedValue is a number and valueType is a float',
                valueType: 'float',
                selectedValue: '123',
                result: false,
            },
            {
                description: 'should not display error message if selectedValue is undefined and valueType is a float',
                valueType: 'float',
                selectedValue: undefined,
                result: false,
            },
        ].forEach(({ description, valueType, selectedValue, result }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                const shouldDisplayErrorMessage = wrapper
                    .instance()
                    .shouldDisplayErrorMessage(valueType, selectedValue);

                expect(shouldDisplayErrorMessage).toEqual(result);
            });
        });
    });
});
