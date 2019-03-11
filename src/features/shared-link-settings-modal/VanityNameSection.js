import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import { sevens } from '../../styles/variables';

import Checkbox from '../../components/checkbox';
import TextInput from '../../components/text-input';
import Fieldset from '../../components/fieldset';
import InlineNotice from '../../components/inline-notice';
import Link from '../../components/link/LinkBase';
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
    warnOnPublic = false,
}) => {
    const inputValue = canChangeVanityName ? vanityName : vanityName || formatMessage(messages.vanityNameNotSet);

    const vanityURLInput = (
        <div className="vanity-name-content">
            <TextInput
                description={
                    <span>
                        <QuarantineBadge color={sevens} />
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
            {warnOnPublic && (
                <InlineNotice type="warning">
                    <FormattedMessage {...messages.sharedLinkWarningText} />{' '}
                    <Link
                        href="https://community.box.com/t5/Using-Shared-Links/Shared-Link-Settings/ta-p/50250"
                        target="_blank"
                    >
                        <FormattedMessage {...messages.sharedLinkWarningLinkText} />
                    </Link>
                </InlineNotice>
            )}
            <Fieldset className="vanity-name-section" title={<FormattedMessage {...messages.customURLLabel} />}>
                <Checkbox
                    label={<FormattedMessage {...messages.vanityURLEnableText} />}
                    isChecked={isVanityEnabled}
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
    intl: intlShape.isRequired,
    isVanityEnabled: PropTypes.bool.isRequired,
    vanityName: PropTypes.string.isRequired,
    vanityNameInputProps: PropTypes.object,
    serverURL: PropTypes.string.isRequired,
    onChange: PropTypes.func,
};

export { VanityNameSection as VanityNameSectionBase };
export default injectIntl(VanityNameSection);
