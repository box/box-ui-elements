// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import InlineError from '../../components/inline-error/InlineError';

import TextMetadataField from './TextMetadataField';
import EnumMetadataField from './EnumMetadataField';
import DateMetadataField from './DateMetadataField';
import FloatMetadataField from './FloatMetadataField';
import IntegerMetadataField from './IntegerMetadataField';
import MultiSelectMetadataField from './MultiSelectMetadataField';
import ReadOnlyMetadataField from './ReadOnlyMetadataField';
import messages from './messages';
import type { MetadataFieldValue, MetadataTemplateFieldOption, MetadataFieldType } from '../../common/types/metadata';

import {
    FIELD_TYPE_ENUM,
    FIELD_TYPE_FLOAT,
    FIELD_TYPE_INTEGER,
    FIELD_TYPE_STRING,
    FIELD_TYPE_DATE,
    FIELD_TYPE_MULTISELECT,
} from './constants';

type Props = {
    blurExceptionClassNames?: Array<string>,
    canEdit: boolean,
    dataKey: string,
    dataValue?: MetadataFieldValue,
    description?: string,
    displayName: string,
    error?: React.Node,
    isHidden?: boolean,
    onChange?: (key: string, value: MetadataFieldValue) => void,
    onRemove?: (key: string) => void,
    options?: Array<MetadataTemplateFieldOption>,
    type: MetadataFieldType,
};

const MetadataField = ({
    blurExceptionClassNames,
    dataKey,
    dataValue,
    displayName,
    description,
    error,
    isHidden,
    canEdit,
    onChange,
    onRemove,
    options,
    type,
}: Props) => {
    if (isHidden) {
        return null;
    }

    if (!canEdit) {
        return (
            <ReadOnlyMetadataField
                dataValue={dataValue}
                description={description}
                displayName={displayName}
                type={type}
            />
        );
    }

    if (!onChange || !onRemove) {
        throw new Error('Need to have onChange and onRemove');
    }

    switch (type) {
        case FIELD_TYPE_STRING:
            return (
                <TextMetadataField
                    dataKey={dataKey}
                    dataValue={dataValue}
                    description={description}
                    displayName={displayName}
                    onChange={onChange}
                    onRemove={onRemove}
                />
            );

        case FIELD_TYPE_FLOAT:
            return (
                <FloatMetadataField
                    dataKey={dataKey}
                    dataValue={dataValue}
                    description={description}
                    displayName={displayName}
                    error={error}
                    onChange={onChange}
                    onRemove={onRemove}
                    type={type}
                />
            );

        case FIELD_TYPE_INTEGER:
            return (
                <IntegerMetadataField
                    dataKey={dataKey}
                    dataValue={dataValue}
                    description={description}
                    displayName={displayName}
                    error={error}
                    onChange={onChange}
                    onRemove={onRemove}
                    type={type}
                />
            );

        case FIELD_TYPE_ENUM:
            return (
                <EnumMetadataField
                    blurExceptionClassNames={blurExceptionClassNames}
                    dataKey={dataKey}
                    dataValue={dataValue}
                    description={description}
                    displayName={displayName}
                    onChange={onChange}
                    onRemove={onRemove}
                    options={options}
                />
            );

        case FIELD_TYPE_MULTISELECT:
            return (
                <MultiSelectMetadataField
                    blurExceptionClassNames={blurExceptionClassNames}
                    dataKey={dataKey}
                    dataValue={dataValue}
                    description={description}
                    displayName={displayName}
                    onChange={onChange}
                    onRemove={onRemove}
                    options={options}
                />
            );

        case FIELD_TYPE_DATE:
            return (
                <DateMetadataField
                    dataKey={dataKey}
                    dataValue={dataValue}
                    description={description}
                    displayName={displayName}
                    onChange={onChange}
                    onRemove={onRemove}
                />
            );

        default:
            return (
                <InlineError title={type}>
                    <FormattedMessage {...messages.invalidMetadataFieldType} />
                </InlineError>
            );
    }
};

export default MetadataField;
