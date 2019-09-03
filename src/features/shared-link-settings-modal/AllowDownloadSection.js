import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import Checkbox from '../../components/checkbox';
import TextInputWithCopyButton from '../../components/text-input-with-copy-button';
import Fieldset from '../../components/fieldset';
import Tooltip from '../../components/tooltip';

import messages from './messages';

const AllowDownloadSection = ({
    canChangeDownload,
    classification,
    directLink,
    directLinkInputProps = {},
    downloadCheckboxProps = {},
    isDirectLinkAvailable,
    isDirectLinkUnavailableDueToDownloadSettings,
    isDirectLinkUnavailableDueToAccessPolicy,
    isDownloadAvailable,
    isDownloadEnabled,
    onChange,
}) => {
    if (!isDownloadAvailable && !isDirectLinkAvailable) {
        return null;
    }

    const directLinkSection = (
        <div>
            <TextInputWithCopyButton
                className="direct-link-input"
                label={<FormattedMessage {...messages.directLinkLabel} />}
                type="url"
                value={directLink}
                {...directLinkInputProps}
            />
        </div>
    );

    const tooltipMessage = classification
        ? { ...messages.directDownloadBlockedByAccessPolicyWithClassification }
        : { ...messages.directDownloadBlockedByAccessPolicyWithoutClassification };

    const allowDownloadSectionClass = classNames('bdl-AllowDownloadSection', {
        'bdl-is-disabled': isDirectLinkUnavailableDueToAccessPolicy,
    });
    const isDirectLinkSectionVisible =
        (isDirectLinkAvailable || isDirectLinkUnavailableDueToDownloadSettings) && isDownloadEnabled;

    if (isDownloadAvailable) {
        return (
            <div className={allowDownloadSectionClass}>
                <hr />
                <Tooltip
                    isDisabled={!isDirectLinkUnavailableDueToAccessPolicy}
                    text={<FormattedMessage {...tooltipMessage} />}
                    position="middle-left"
                >
                    <Fieldset
                        disabled={isDirectLinkUnavailableDueToAccessPolicy}
                        title={<FormattedMessage {...messages.allowDownloadTitle} />}
                    >
                        <Checkbox
                            isChecked={isDownloadEnabled}
                            isDisabled={!canChangeDownload || isDirectLinkUnavailableDueToAccessPolicy}
                            label={<FormattedMessage {...messages.allowDownloadLabel} />}
                            name="isDownloadEnabled"
                            onChange={onChange}
                            {...downloadCheckboxProps}
                        />
                        {isDirectLinkSectionVisible && directLinkSection}
                    </Fieldset>
                </Tooltip>
            </div>
        );
    }

    // When download section not available but direct link is available
    return (
        <div>
            <hr />
            {directLinkSection}
        </div>
    );
};

AllowDownloadSection.propTypes = {
    canChangeDownload: PropTypes.bool.isRequired,
    classification: PropTypes.object,
    directLink: PropTypes.string.isRequired,
    directLinkInputProps: PropTypes.object,
    downloadCheckboxProps: PropTypes.object,
    isDirectLinkAvailable: PropTypes.bool.isRequired,
    isDirectLinkUnavailableDueToAccessPolicy: PropTypes.bool,
    isDirectLinkUnavailableDueToDownloadSettings: PropTypes.bool.isRequired,
    isDownloadAvailable: PropTypes.bool.isRequired,
    isDownloadEnabled: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default AllowDownloadSection;
