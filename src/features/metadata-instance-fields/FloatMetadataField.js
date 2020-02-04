// @flow
import * as React from 'react';

import TextMetadataField from './TextMetadataField';
import { isValidValue } from './validateMetadataField';
import type { MetadataFieldValue } from '../../common/types/metadata';

type Props = {
    dataKey: string,
    dataValue?: MetadataFieldValue,
    description?: string,
    displayName: string,
    error?: React.Node,
    onChange: (key: string, value: MetadataFieldValue) => void,
    onRemove: (key: string) => void,
    type: string,
};

const FloatMetadataField = ({
    dataKey,
    dataValue,
    displayName,
    description,
    error,
    onChange,
    onRemove,
    type,
}: Props) => (
    <TextMetadataField
        dataKey={dataKey}
        dataValue={dataValue}
        description={description}
        displayName={displayName}
        error={error}
        onChange={(key: string, value: MetadataFieldValue) => {
            if (isValidValue(type, value)) {
                onChange(key, value);
            }
        }}
        onRemove={onRemove}
    />
);

export default FloatMetadataField;
