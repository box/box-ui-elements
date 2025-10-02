// @flow
import * as React from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';

import { convertISOStringToUTCDate } from '../../utils/datetime';

import { FIELD_TYPE_DATE } from './constants';
import messages from './messages';
import type { MetadataFieldValue, MetadataFieldType } from '../../common/types/metadata';
import './ReadOnlyMetadataField.scss';

type Props = {
    dataValue?: MetadataFieldValue,
    description?: string,
    displayName: string,
    type: MetadataFieldType,
};

const ReadOnlyMetadataField = ({ dataValue, description, displayName, type }: Props) => {
    let value = <FormattedMessage tagName="i" {...messages.metadataFieldNoValue} />;

    if (dataValue || typeof dataValue === 'number') {
        if (typeof dataValue === 'string' && type === FIELD_TYPE_DATE) {
            value = (
                <FormattedDate day="numeric" month="long" value={convertISOStringToUTCDate(dataValue)} year="numeric" />
            );
        } else if (Array.isArray(dataValue)) {
            value = dataValue.join(', ');
        } else {
            value = dataValue;
        }
    }

    return (
        <dl className="bdl-ReadOnlyMetadataField">
            <dt>{displayName}</dt>
            {!!description && <i className="bdl-ReadOnlyMetadataField-desc">{description}</i>}
            <dd>{value}</dd>
        </dl>
    );
};

export default ReadOnlyMetadataField;
