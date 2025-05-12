// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';

import TextInput from '../../components/text-input';

import messages from './messages';
import type { MetadataFieldValue } from '../../common/types/metadata';
import './TextMetadataField.scss';

type Props = {
    dataKey: string,
    dataValue?: MetadataFieldValue,
    description?: string,
    displayName: string,
    error?: React.Node,
    isDisabled?: boolean,
    intl: any,
    onChange: (key: string, value: MetadataFieldValue) => void,
    onRemove: (key: string) => void,
    type?: string,
};

const TextMetadataField = ({
    dataKey,
    dataValue,
    displayName,
    description,
    error,
    intl,
    isDisabled,
    onChange,
    onRemove,
    type = 'text',
}: Props) => {
    let value = '';

    if (typeof dataValue === 'number') {
        value = dataValue;
    } else if (dataValue) {
        value = dataValue;
    }

    return (
        <TextInput
            className="bdl-TextMetadataField"
            description={description}
            error={error}
            hideOptionalLabel
            disabled={isDisabled}
            label={displayName}
            name={dataKey}
            onChange={(event: SyntheticKeyboardEvent<HTMLInputElement>) => {
                const currentTarget = (event.currentTarget: HTMLInputElement);
                if (currentTarget.value) {
                    onChange(dataKey, currentTarget.value);
                } else {
                    onRemove(dataKey);
                }
            }}
            placeholder={intl.formatMessage(messages.metadataFieldSetValue)}
            type={type}
            value={value}
        />
    );
};

export { TextMetadataField as TextMetadataFieldBase };
export default injectIntl(TextMetadataField);
