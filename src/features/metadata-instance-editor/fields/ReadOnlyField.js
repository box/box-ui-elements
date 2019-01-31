// @flow
import * as React from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';

import { convertISOStringToUTCDate } from 'utils/datetime';

import { FIELD_TYPE_DATE } from '../constants';
import messages from '../messages';
import './ReadOnlyField.scss';

type Props = {
    dataValue?: MetadataFieldValue,
    description?: string,
    displayName: string,
    type: MetadataFieldType,
};

const ReadOnlyField = ({ dataValue, description, displayName, type }: Props) => {
    let value = <FormattedMessage tagName="i" {...messages.metadataFieldNoValue} />;

    if (dataValue || typeof dataValue === 'number') {
        if (typeof dataValue === 'string' && type === FIELD_TYPE_DATE) {
            value = (
                <FormattedDate value={convertISOStringToUTCDate(dataValue)} year="numeric" month="long" day="numeric" />
            );
        } else if (Array.isArray(dataValue)) {
            value = dataValue.join(', ');
        } else {
            value = dataValue;
        }
    }

    return (
        <dl className="metadata-instance-editor-field-read-only">
            <dt>{displayName}</dt>
            {!!description && <i className="metadata-instance-editor-field-read-only-desc">{description}</i>}
            <dd>{value}</dd>
        </dl>
    );
};

export default ReadOnlyField;
