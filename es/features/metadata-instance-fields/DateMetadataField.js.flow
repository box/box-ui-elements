// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';

import DatePicker from '../../components/date-picker';
import { convertISOStringToUTCDate } from '../../utils/datetime';
import messages from './messages';
import type { MetadataFieldValue } from '../../common/types/metadata';
import './DateMetadataField.scss';

type Props = {
    dataKey: string,
    dataValue?: MetadataFieldValue,
    description?: string,
    displayName: string,
    isDisabled?: boolean,
    onChange: (key: string, value: MetadataFieldValue) => void,
    onRemove: (key: string) => void,
};

const DateMetadataField = ({ dataKey, dataValue, displayName, description, isDisabled, onChange, onRemove }: Props) => {
    const { formatMessage } = useIntl();

    return (
        <DatePicker
            className="bdl-DateMetadataField"
            dateFormat="utcISOString"
            description={description}
            displayFormat={{
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }}
            hideOptionalLabel
            isDisabled={isDisabled}
            label={displayName}
            onChange={(date: Date, isoDate: string) => {
                if (isoDate) {
                    onChange(dataKey, isoDate);
                } else {
                    onRemove(dataKey);
                }
            }}
            placeholder={formatMessage(messages.metadataFieldSetDate)}
            value={typeof dataValue === 'string' ? convertISOStringToUTCDate(dataValue) : undefined}
        />
    );
};

export default DateMetadataField;
