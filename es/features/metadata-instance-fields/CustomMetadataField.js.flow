// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';

import Button from '../../components/button/Button';
import ButtonGroup from '../../components/button-group/ButtonGroup';
import IconMinus from '../../icons/general/IconMinusThin';
import IconPlus from '../../icons/general/IconPlusThin';
import Field from './MetadataField';
import messages from './messages';
import type { MetadataFieldValue } from '../../common/types/metadata';
import './CustomMetadataField.scss';

type Props = {
    canEdit: boolean,
    dataKey: string,
    dataValue: MetadataFieldValue,
    intl: any,
    isLast: boolean,
    onAdd: () => void,
    onChange: (key: string, value: MetadataFieldValue) => void,
    onRemove: (key: string) => void,
};

const COLOR_999 = '#999';

const CustomMetadataField = ({ intl, canEdit, isLast, dataKey, dataValue, onAdd, onChange, onRemove }: Props) => {
    const addBtn = (
        <Button
            aria-label={intl.formatMessage(messages.customAdd)}
            data-resin-target="metadata-customfieldnew"
            onClick={onAdd}
            type="button"
        >
            <IconPlus color={COLOR_999} />
        </Button>
    );

    const removeBtn = (
        <Button
            aria-label={intl.formatMessage(messages.customRemove)}
            data-resin-target="metadata-customfieldremove"
            onClick={() => {
                if (onRemove) {
                    onRemove(dataKey);
                }
            }}
            type="button"
        >
            <IconMinus color={COLOR_999} />
        </Button>
    );

    return (
        <div className="bdl-CustomMetadataField">
            <Field
                canEdit={canEdit}
                dataKey={dataKey}
                dataValue={dataValue}
                displayName={dataKey}
                onChange={onChange}
                // Custom metadata doesn't allow removing of props if the value is emptied out, leave it as empty string
                onRemove={(key: string) => onChange(key, '')}
                type="string"
            />
            {canEdit && (
                <div className="bdl-CustomMetadataField-customActions">
                    {isLast ? (
                        <ButtonGroup>
                            {removeBtn}
                            {addBtn}
                        </ButtonGroup>
                    ) : (
                        removeBtn
                    )}
                </div>
            )}
        </div>
    );
};

export { CustomMetadataField as CustomMetadataFieldBase };
export default injectIntl(CustomMetadataField);
