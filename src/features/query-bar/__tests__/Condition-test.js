// @flow
import * as React from 'react';

import {
    FIELD_TYPE_STRING,
    FIELD_TYPE_DATE,
    FIELD_TYPE_FLOAT,
    FIELD_TYPE_ENUM,
} from '../../metadata-instance-editor/constants';
import { initialCondition } from '../components/fixtures';

import { ATTRIBUTE_KEY, OPERATOR_KEY, VALUE_KEY } from '../constants';

import { BaseCondition as Condition } from '../components/filter/Condition';

describe('features/query-bar/components/filter/Condition', () => {
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

        return shallow(
            <Condition
                index={0}
                template={template}
                condition={initialCondition}
                deleteCondition={() => {}}
                update={() => {}}
                intl={{ formatMessage: () => {} }}
                {...props}
            />,
        );
    };

    describe('render()', () => {
        test('should render Condition', () => {
            const condition = initialCondition;
            const wrapper = getWrapper({ condition });

            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('updateSelectedField()', () => {
        const displayText = 'Vendor Name';
        const index = 0;
        const condition = initialCondition;
        const value = 0;
        const option = {
            value,
            displayText,
            type: 'string',
        };
        const fieldId = undefined;
        const valueType = 'string';

        test.each`
            description                         | fieldType      | displayTextType           | keyType
            ${'user has selected an attribute'} | ${'attribute'} | ${'attributeDisplayText'} | ${ATTRIBUTE_KEY}
            ${'user has selected an operator'}  | ${'operator'}  | ${'operatorDisplayText'}  | ${OPERATOR_KEY}
            ${'user has selected a value'}      | ${'value'}     | ${'valueDisplayText'}     | ${VALUE_KEY}
        `('$description', ({ fieldType, displayTextType, keyType }) => {
            const update = jest.fn();
            const wrapper = getWrapper({
                update,
            });

            wrapper
                .find('SingleSelectField')
                .at(1)
                .simulate('change', option, fieldType);

            expect(update).toHaveBeenCalledWith(
                index,
                condition,
                displayText,
                displayTextType,
                fieldId,
                value,
                keyType,
                valueType,
            );
        });
    });

    describe('updateValueField()', () => {
        const stringFieldValue = {
            target: {
                value: '',
            },
        };
        const index = 0;
        const condition = initialCondition;
        const dateFieldValue = new Date(2018, 11, 24, 10, 33, 30, 0);
        const fieldId = undefined;
        const valueType = 'string';
        const keyType = VALUE_KEY;
        const displayTextType = 'valueDisplayText';

        test.each`
            description                                                | fieldValue          | displayText       | value
            ${'user has entered an empty string into the value field'} | ${stringFieldValue} | ${''}             | ${''}
            ${'user has selected a date in the date picker'}           | ${dateFieldValue}   | ${dateFieldValue} | ${dateFieldValue}
        `('$description', ({ fieldValue, displayText, value }) => {
            const update = jest.fn();
            const wrapper = getWrapper({ update });

            wrapper.find('ValueField').prop('updateValueField')(fieldValue);

            expect(update).toHaveBeenCalledWith(
                index,
                condition,
                displayText,
                displayTextType,
                fieldId,
                value,
                keyType,
                valueType,
            );
        });
    });
});
