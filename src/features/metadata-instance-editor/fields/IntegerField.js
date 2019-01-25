// @flow
import * as React from 'react';

import TextField from './TextField';
import { isValidValue } from './validateField';

import type { FieldValue } from '../flowTypes';

type Props = {
    dataKey: string,
    dataValue?: FieldValue,
    description?: string,
    displayName: string,
    error?: React.Node,
    onChange: (key: string, value: FieldValue) => void,
    onRemove: (key: string) => void,
    type: string,
};

const IntegerField = ({ dataKey, dataValue, displayName, description, error, onChange, onRemove, type }: Props) => (
    <TextField
        dataKey={dataKey}
        dataValue={dataValue}
        description={description}
        displayName={displayName}
        error={error}
        onChange={(key: string, value: FieldValue) => {
            if (isValidValue(type, value)) {
                onChange(key, value);
            }
        }}
        onRemove={onRemove}
    />
);

export default IntegerField;
