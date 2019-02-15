// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';

import DatePicker from '../../../components/date-picker';
import { convertISOStringToUTCDate } from '../../../utils/datetime';

import messages from '../messages';
import './DateField.scss';

type Props = {
    dataKey: string,
    dataValue?: MetadataFieldValue,
    description?: string,
    displayName: string,
    intl: any,
    onChange: (key: string, value: MetadataFieldValue) => void,
    onRemove: (key: string) => void,
};

const DateField = ({ dataKey, dataValue, displayName, description, intl, onChange, onRemove }: Props) => (
    <DatePicker
        className="metadata-instance-editor-field-date"
        dateFormat="utcISOString"
        description={description}
        displayFormat={{
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }}
        hideOptionalLabel
        label={displayName}
        onChange={(date: Date, isoDate: string) => {
            if (isoDate) {
                onChange(dataKey, isoDate);
            } else {
                onRemove(dataKey);
            }
        }}
        placeholder={intl.formatMessage(messages.metadataFieldSetDate)}
        value={typeof dataValue === 'string' ? convertISOStringToUTCDate(dataValue) : undefined}
    />
);

export { DateField as DateFieldBase };
export default injectIntl(DateField);
