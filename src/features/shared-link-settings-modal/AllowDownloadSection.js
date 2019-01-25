import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Checkbox from 'components/checkbox';
import TextInputWithCopyButton from 'components/text-input-with-copy-button';
import Fieldset from 'components/fieldset';

import messages from './messages';

const AllowDownloadSection = ({
    canChangeDownload,
    directLink,
    directLinkInputProps = {},
    downloadCheckboxProps = {},
    isDirectLinkAvailable,
    isDirectLinkUnavailableDueToDownloadSettings,
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

    if (isDownloadAvailable) {
        return (
            <div>
                <hr />
                <Fieldset title={<FormattedMessage {...messages.allowDownloadTitle} />}>
                    <Checkbox
                        isChecked={isDownloadEnabled}
                        isDisabled={!canChangeDownload}
                        label={<FormattedMessage {...messages.allowDownloadLabel} />}
                        name="isDownloadEnabled"
                        onChange={onChange}
                        {...downloadCheckboxProps}
                    />
                    {(isDirectLinkAvailable || isDirectLinkUnavailableDueToDownloadSettings) && isDownloadEnabled
                        ? directLinkSection
                        : null}
                </Fieldset>
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
    directLink: PropTypes.string.isRequired,
    directLinkInputProps: PropTypes.object,
    downloadCheckboxProps: PropTypes.object,
    isDirectLinkAvailable: PropTypes.bool.isRequired,
    isDirectLinkUnavailableDueToDownloadSettings: PropTypes.bool.isRequired,
    isDownloadAvailable: PropTypes.bool.isRequired,
    isDownloadEnabled: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default AllowDownloadSection;
