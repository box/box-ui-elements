// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';

import Label from '../../components/label/Label';
import SingleSelectField from '../../components/select-field/SingleSelectField';
import messages from './messages';
import type { MetadataFieldValue, MetadataTemplateFieldOption } from '../../common/types/metadata';
import './EnumMetadataField.scss';

type Option = {
    displayText: string,
    isSelectable: boolean,
    value: string,
};

type Props = {
    blurExceptionClassNames?: Array<string>,
    dataKey: string,
    dataValue?: MetadataFieldValue,
    description?: string,
    displayName: string,
    isDisabled?: boolean,
    intl: any,
    onChange: (key: string, value: MetadataFieldValue) => void,
    onRemove: (key: string) => void,
    options?: Array<MetadataTemplateFieldOption>,
};

const EnumMetadataField = ({
    blurExceptionClassNames,
    dataKey,
    dataValue,
    displayName,
    description,
    isDisabled,
    intl,
    onChange,
    onRemove,
    options = [],
}: Props) => {
    const selectOptions = options.map(option => ({
        displayText: option.key,
        value: option.key,
        isSelectable: true,
    }));

    const defaultValue = intl.formatMessage(messages.metadataFieldSelectValue);

    selectOptions.unshift({
        displayText: defaultValue,
        value: defaultValue,
        isSelectable: false,
    });

    return (
        <div className="bdl-EnumMetadataField">
            <Label text={displayName}>
                {!!description && <i className="bdl-EnumMetadataField-desc">{description}</i>}
                <SingleSelectField
                    blurExceptionClassNames={blurExceptionClassNames}
                    isEscapedWithReference
                    isDisabled={isDisabled}
                    isScrollable
                    onChange={(option: Option) => {
                        if (option.isSelectable) {
                            onChange(dataKey, option.value);
                        } else if (onRemove) {
                            onRemove(dataKey);
                        }
                    }}
                    options={selectOptions}
                    selectedValue={
                        // Conditional to make flow happy, dataValue should never be an array
                        Array.isArray(dataValue) ? dataValue.join(', ') : dataValue || defaultValue
                    }
                />
            </Label>
        </div>
    );
};

export { EnumMetadataField as EnumMetadataFieldBase };
export default injectIntl(EnumMetadataField);
