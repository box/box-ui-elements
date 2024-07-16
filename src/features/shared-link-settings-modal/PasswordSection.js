import * as React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import Checkbox from '../../components/checkbox';
import TextInput from '../../components/text-input';
import Fieldset from '../../components/fieldset';

import ExclamationMarkBadge16 from '../../icon/line/ExclamationMarkBadge16';

import messages from './messages';

const PasswordSection = ({
    canChangePassword,
    error,
    intl: { formatMessage },
    isPasswordAvailable,
    isPasswordEnabled,
    isPasswordInitiallyEnabled,
    onCheckboxChange,
    onPasswordChange,
    password,
    passwordCheckboxProps = {},
    passwordInformationText,
    passwordInputProps = {},
}) => {
    if (!isPasswordAvailable) {
        return null;
    }
    const passwordInput = (
        <div>
            <TextInput
                disabled={!canChangePassword}
                error={error}
                hideLabel
                isRequired={!isPasswordInitiallyEnabled}
                label={<FormattedMessage {...messages.passwordPlaceholder} />}
                maxLength={100 /* maxlength due to backend constraint */}
                name="password"
                onChange={onPasswordChange}
                placeholder={isPasswordInitiallyEnabled ? '••••••••' : formatMessage(messages.passwordPlaceholder)}
                type="password"
                value={password}
                {...passwordInputProps}
            />
            {passwordInformationText && (
                <div className="be password-section-information">
                    <span>
                        <ExclamationMarkBadge16 className="password-section-information-icon" height={12} width={12} />
                    </span>
                    <span className="password-section-information-text">{passwordInformationText}</span>
                </div>
            )}
        </div>
    );
    return (
        <div>
            <hr />
            <Fieldset className="be password-section" title={<FormattedMessage {...messages.passwordTitle} />}>
                <Checkbox
                    isChecked={isPasswordEnabled}
                    isDisabled={!canChangePassword}
                    label={<FormattedMessage {...messages.passwordLabel} />}
                    name="isPasswordEnabled"
                    onChange={onCheckboxChange}
                    subsection={isPasswordEnabled ? passwordInput : undefined}
                    {...passwordCheckboxProps}
                />
            </Fieldset>
        </div>
    );
};
PasswordSection.propTypes = {
    canChangePassword: PropTypes.bool.isRequired,
    error: PropTypes.string,
    intl: PropTypes.any,
    isPasswordAvailable: PropTypes.bool.isRequired,
    isPasswordEnabled: PropTypes.bool.isRequired,
    isPasswordInitiallyEnabled: PropTypes.bool.isRequired,
    onCheckboxChange: PropTypes.func.isRequired,
    onPasswordChange: PropTypes.func.isRequired,
    password: PropTypes.string,
    passwordCheckboxProps: PropTypes.object,
    passwordInformationText: PropTypes.string,
    passwordInputProps: PropTypes.object,
};

export { PasswordSection as PasswordSectionBase };
export default injectIntl(PasswordSection);
