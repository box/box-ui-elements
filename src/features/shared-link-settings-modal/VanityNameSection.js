import * as React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import { bdlGray65 } from '../../styles/variables';

import Checkbox from '../../components/checkbox';
import TextInput from '../../components/text-input';
import Fieldset from '../../components/fieldset';
import QuarantineBadge from '../../icons/badges/QuarantineBadge';

import messages from './messages';

const VanityNameSection = ({
    canChangeVanityName,
    error,
    intl: { formatMessage },
    isVanityEnabled,
    vanityName,
    vanityNameInputProps = {},
    serverURL,
    onChange,
    onCheckboxChange,
}) => {
    const inputValue = canChangeVanityName ? vanityName : vanityName || formatMessage(messages.vanityNameNotSet);

    const vanityURLInput = (
        <div className="vanity-name-content">
            <TextInput
                description={
                    <span>
                        <QuarantineBadge color={bdlGray65} />
                        <FormattedMessage {...messages.vanityURLWarning} />
                    </span>
                }
                hideLabel
                disabled={!canChangeVanityName}
                error={error}
                name="vanityName"
                onChange={onChange}
                placeholder={formatMessage(messages.vanityNamePlaceholder)}
                type="text"
                value={inputValue}
                {...vanityNameInputProps}
            />
            {(canChangeVanityName || !!vanityName) && (
                <p className="custom-url-preview">{`${serverURL}${vanityName}`}</p>
            )}
        </div>
    );

    return (
        <div>
            <hr />
            <Fieldset className="be vanity-name-section" title={<FormattedMessage {...messages.customURLLabel} />}>
                <Checkbox
                    label={<FormattedMessage {...messages.vanityURLEnableText} />}
                    isChecked={isVanityEnabled}
                    isDisabled={!canChangeVanityName}
                    subsection={isVanityEnabled ? vanityURLInput : undefined}
                    onChange={onCheckboxChange}
                />
            </Fieldset>
        </div>
    );
};

VanityNameSection.propTypes = {
    canChangeVanityName: PropTypes.bool.isRequired,
    error: PropTypes.string,
    intl: PropTypes.any,
    isVanityEnabled: PropTypes.bool.isRequired,
    vanityName: PropTypes.string.isRequired,
    vanityNameInputProps: PropTypes.object,
    serverURL: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onCheckboxChange: PropTypes.func,
};

export { VanityNameSection as VanityNameSectionBase };
export default injectIntl(VanityNameSection);
