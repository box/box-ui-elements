import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import TextInput from '../../components/text-input';

import messages from './messages';

const VanityNameSection = ({
    canChangeVanityName,
    error,
    intl: { formatMessage },
    vanityName,
    vanityNameInputProps = {},
    serverURL,
    onChange,
}) => {
    const inputValue = canChangeVanityName ? vanityName : vanityName || formatMessage(messages.vanityNameNotSet);
    return (
        <div className="vanity-name-section">
            <TextInput
                disabled={!canChangeVanityName}
                error={error}
                label={<FormattedMessage {...messages.customURLLabel} />}
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
};

VanityNameSection.propTypes = {
    canChangeVanityName: PropTypes.bool.isRequired,
    error: PropTypes.string,
    intl: intlShape.isRequired,
    vanityName: PropTypes.string.isRequired,
    vanityNameInputProps: PropTypes.object,
    serverURL: PropTypes.string.isRequired,
    onChange: PropTypes.func,
};

export { VanityNameSection as VanityNameSectionBase };
export default injectIntl(VanityNameSection);
