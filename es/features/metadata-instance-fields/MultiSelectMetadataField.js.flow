// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Label from '../../components/label/Label';
import MultiSelect from '../../components/select-field/MultiSelectField';
import type { SelectOptionProp } from '../../components/select-field/props';

import messages from './messages';

import type { MetadataFieldValue, MetadataTemplateFieldOption } from '../../common/types/metadata';

import './MultiSelectMetadataField.scss';

type Props = {
    blurExceptionClassNames?: Array<string>,
    dataKey: string,
    dataValue?: MetadataFieldValue,
    description?: string,
    displayName: string,
    isDisabled?: boolean,
    onChange: (key: string, value: MetadataFieldValue) => void,
    onRemove: (key: string) => void,
    options?: Array<MetadataTemplateFieldOption>,
};

const MultiSelectMetadataField = ({
    blurExceptionClassNames,
    dataKey,
    dataValue,
    displayName,
    description,
    isDisabled,
    onChange,
    onRemove,
    options = [],
}: Props) => {
    const placeholder = <FormattedMessage {...messages.metadataFieldMultiSelectValue} />;

    return (
        <div className="bdl-MultiSelectMetadataField">
            <Label text={displayName}>
                {!!description && <i className="bdl-MultiSelectMetadataField-desc">{description}</i>}
                <MultiSelect
                    blurExceptionClassNames={blurExceptionClassNames}
                    isDisabled={isDisabled}
                    isEscapedWithReference
                    isScrollable
                    onChange={(selectedOptions: Array<SelectOptionProp>) => {
                        if (selectedOptions.length) {
                            onChange(
                                dataKey,
                                selectedOptions.map(({ value }) => value),
                            );
                        } else {
                            onRemove(dataKey);
                        }
                    }}
                    options={options.map(option => ({
                        displayText: option.key,
                        value: option.key,
                    }))}
                    placeholder={placeholder}
                    selectedValues={dataValue}
                />
            </Label>
        </div>
    );
};

export { MultiSelectMetadataField as MultiSelectMetadataFieldBase };
export default MultiSelectMetadataField;
