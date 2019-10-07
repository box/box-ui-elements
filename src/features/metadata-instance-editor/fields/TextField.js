// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';

import TextInput from '../../../components/text-input';

import messages from '../messages';
import './TextField.scss';

type Props = {
    dataKey: string,
    dataValue?: MetadataFieldValue,
    description?: string,
    displayName: string,
    error?: React.Node,
    intl: any,
    onChange: (key: string, value: MetadataFieldValue) => void,
    onRemove: (key: string) => void,
    type?: string,
};

const TextField = ({
    dataKey,
    dataValue,
    displayName,
    description,
    error,
    intl,
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
            className="metadata-instance-editor-field-text"
            description={description}
            error={error}
            hideOptionalLabel
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

export { TextField as TextFieldBase };
export default injectIntl(TextField);
