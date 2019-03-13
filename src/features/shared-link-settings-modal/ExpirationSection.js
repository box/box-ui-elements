import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Checkbox from '../../components/checkbox';
import DatePicker from '../../components/date-picker';
import Fieldset from '../../components/fieldset';

import messages from './messages';

const displayFormat = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
};

const ExpirationSection = ({
    canChangeExpiration,
    error,
    expirationCheckboxProps = {},
    expirationDate,
    expirationInputProps = {},
    isExpirationEnabled,
    onCheckboxChange,
    onExpirationDateChange,
}) => {
    const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    const datepicker = (
        <div>
            <DatePicker
                displayFormat={displayFormat}
                error={error}
                hideLabel
                inputProps={expirationInputProps}
                isDisabled={!canChangeExpiration}
                isRequired
                label={<FormattedMessage {...messages.expirationLabel} />}
                minDate={tomorrow}
                name="expiration"
                onChange={onExpirationDateChange}
                value={expirationDate}
            />
        </div>
    );
    return (
        <div>
            <hr />
            <Fieldset className="expiration-section" title={<FormattedMessage {...messages.expirationTitle} />}>
                <Checkbox
                    isChecked={isExpirationEnabled}
                    isDisabled={!canChangeExpiration}
                    label={<FormattedMessage {...messages.expirationLabel} />}
                    name="isExpirationEnabled"
                    onChange={onCheckboxChange}
                    subsection={isExpirationEnabled ? datepicker : undefined}
                    {...expirationCheckboxProps}
                />
            </Fieldset>
        </div>
    );
};

ExpirationSection.propTypes = {
    canChangeExpiration: PropTypes.bool.isRequired,
    error: PropTypes.string,
    expirationCheckboxProps: PropTypes.object,
    expirationDate: PropTypes.instanceOf(Date),
    expirationInputProps: PropTypes.object,
    isExpirationEnabled: PropTypes.bool.isRequired,
    onCheckboxChange: PropTypes.func.isRequired,
    onExpirationDateChange: PropTypes.func.isRequired,
};
export default ExpirationSection;
