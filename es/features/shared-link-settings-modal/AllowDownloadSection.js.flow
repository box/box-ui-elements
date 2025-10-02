import * as React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import Checkbox from '../../components/checkbox';
import TextInputWithCopyButton from '../../components/text-input-with-copy-button';
import Fieldset from '../../components/fieldset';
import Tooltip from '../../components/tooltip';

import messages from './messages';

import './AllowDownloadSection.scss';

const AllowDownloadSection = ({
    canChangeDownload,
    classification,
    directLink,
    directLinkInputProps = {},
    downloadCheckboxProps = {},
    isDirectLinkAvailable,
    isDirectLinkUnavailableDueToDownloadSettings,
    isDirectLinkUnavailableDueToAccessPolicy,
    isDirectLinkUnavailableDueToMaliciousContent,
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
    const isDirectLinkUnavailable =
        isDirectLinkUnavailableDueToAccessPolicy || isDirectLinkUnavailableDueToMaliciousContent;
    const allowDownloadSectionClass = classNames('bdl-AllowDownloadSection', {
        'bdl-is-disabled': isDirectLinkUnavailable,
    });
    const isDirectLinkSectionVisible =
        (isDirectLinkAvailable || isDirectLinkUnavailableDueToDownloadSettings) && isDownloadEnabled;

    let tooltipMessage = null;

    if (isDirectLinkUnavailableDueToMaliciousContent) {
        tooltipMessage = { ...messages.directDownloadBlockedByMaliciousContent };
    } else if (classification) {
        tooltipMessage = { ...messages.directDownloadBlockedByAccessPolicyWithClassification };
    } else {
        tooltipMessage = { ...messages.directDownloadBlockedByAccessPolicyWithoutClassification };
    }

    if (isDownloadAvailable) {
        return (
            <div className={allowDownloadSectionClass}>
                <hr />
                <Tooltip
                    isDisabled={!isDirectLinkUnavailable}
                    text={<FormattedMessage {...tooltipMessage} />}
                    position="middle-left"
                >
                    <Fieldset
                        className="be"
                        disabled={isDirectLinkUnavailable}
                        title={<FormattedMessage {...messages.allowDownloadTitle} />}
                    >
                        <Checkbox
                            isChecked={isDownloadEnabled}
                            isDisabled={!canChangeDownload || isDirectLinkUnavailable}
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
    classification: PropTypes.string,
    directLink: PropTypes.string.isRequired,
    directLinkInputProps: PropTypes.object,
    downloadCheckboxProps: PropTypes.object,
    isDirectLinkAvailable: PropTypes.bool.isRequired,
    isDirectLinkUnavailableDueToMaliciousContent: PropTypes.bool,
    isDirectLinkUnavailableDueToAccessPolicy: PropTypes.bool,
    isDirectLinkUnavailableDueToDownloadSettings: PropTypes.bool.isRequired,
    isDownloadAvailable: PropTypes.bool.isRequired,
    isDownloadEnabled: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default AllowDownloadSection;
