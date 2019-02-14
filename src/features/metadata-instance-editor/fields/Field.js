// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import InlineError from '../../../components/inline-error/InlineError';

import TextField from './TextField';
import EnumField from './EnumField';
import DateField from './DateField';
import FloatField from './FloatField';
import IntegerField from './IntegerField';
import MultiSelectField from './MultiSelectField';
import ReadOnlyField from './ReadOnlyField';
import messages from '../messages';

import {
    FIELD_TYPE_ENUM,
    FIELD_TYPE_FLOAT,
    FIELD_TYPE_INTEGER,
    FIELD_TYPE_STRING,
    FIELD_TYPE_DATE,
    FIELD_TYPE_MULTISELECT,
} from '../constants';

type Props = {
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

const Field = ({
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
        return <ReadOnlyField dataValue={dataValue} description={description} displayName={displayName} type={type} />;
    }

    if (!onChange || !onRemove) {
        throw new Error('Need to have onChange and onRemove');
    }

    switch (type) {
        case FIELD_TYPE_STRING:
            return (
                <TextField
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
                <FloatField
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
                <IntegerField
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
                <EnumField
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
                <MultiSelectField
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
                <DateField
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

export default Field;
