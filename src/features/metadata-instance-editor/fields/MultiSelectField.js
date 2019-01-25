// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Label from 'components/label/Label';
import MultiSelect from 'components/select-field/MultiSelectField';
import type { SelectOptionProp } from 'components/select-field/props';

import type { FieldValue, TemplateFieldOption } from '../flowTypes';
import messages from '../messages';

import './MultiSelectField.scss';

type Props = {
    dataKey: string,
    dataValue?: FieldValue,
    description?: string,
    displayName: string,
    onChange: (key: string, value: FieldValue) => void,
    onRemove: (key: string) => void,
    options?: Array<TemplateFieldOption>,
};

const MultiSelectField = ({
    dataKey,
    dataValue,
    displayName,
    description,
    onChange,
    onRemove,
    options = [],
}: Props) => {
    const placeholder = <FormattedMessage {...messages.metadataFieldMultiSelectValue} />;

    return (
        <div className="metadata-instance-editor-field-multi-select">
            <Label text={displayName}>
                {!!description && <i className="metadata-instance-editor-field-multi-select-desc">{description}</i>}
                <MultiSelect
                    onChange={(selectedOptions: Array<SelectOptionProp>) => {
                        if (selectedOptions.length) {
                            onChange(dataKey, selectedOptions.map(({ value }) => value));
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

export { MultiSelectField as MultiSelectFieldBase };
export default MultiSelectField;
