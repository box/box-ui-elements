import * as React from 'react';
import classNames from 'classnames';
import { defineMessages, useIntl } from 'react-intl';
import { Text } from '@box/blueprint-web';

import versionSelectors from '../common/selectors/version';
import './PreviewVersionBar.scss';

const MODIFIED_DATE_FORMAT: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
};

type PreviewVersion = {
    created_at?: string;
    modified_at?: string;
    modified_by?: {
        id?: string;
        name?: string;
    } | null;
    promoted_by?: {
        id?: string;
        name?: string;
    } | null;
    restored_at?: string;
    restored_by?: {
        id?: string;
        name?: string;
    } | null;
    trashed_at?: string | null;
    trashed_by?: {
        id?: string;
        name?: string;
    } | null;
    uploader_display_name?: string;
    version_number?: string;
};

export type PreviewVersionBarProps = {
    isCurrent?: boolean;
    version?: PreviewVersion;
};

const messages = defineMessages({
    versionBarLabel: {
        defaultMessage: 'Version {versionNumber} details',
        description: 'Accessible label for the version information shown above a preview pane.',
        id: 'be.contentPreview.versionBarLabel',
    },
    versionBarLabelUnknown: {
        defaultMessage: 'Version details',
        description: 'Accessible label for version information when the version number is unavailable.',
        id: 'be.contentPreview.versionBarLabelUnknown',
    },
});

export default function PreviewVersionBar({ isCurrent = false, version }: PreviewVersionBarProps): React.ReactElement {
    const { formatDate, formatMessage } = useIntl();
    const versionNumber = version?.version_number;
    const modifierName = version ? versionSelectors.getVersionUser(version).name : undefined;
    const modifiedAt = version?.restored_at || version?.trashed_at || version?.created_at || version?.modified_at;
    const modifiedTimestamp = modifiedAt ? Date.parse(modifiedAt) : Number.NaN;
    const hasModifiedDate = !Number.isNaN(modifiedTimestamp);
    const label = versionNumber
        ? formatMessage(messages.versionBarLabel, { versionNumber })
        : formatMessage(messages.versionBarLabelUnknown);

    return (
        <div aria-label={label} className="bcpr-PreviewVersionBar" role="group">
            {versionNumber && (
                <Text
                    as="span"
                    className={classNames('bcpr-PreviewVersionBar-badge', {
                        'bcpr-PreviewVersionBar-badge--current': isCurrent,
                    })}
                    variant="bodySmallSemibold"
                >
                    {versionNumber}
                </Text>
            )}
            <div className="bcpr-PreviewVersionBar-details">
                {hasModifiedDate && (
                    <Text as="span" className="bcpr-PreviewVersionBar-date" variant="bodyDefaultSemibold">
                        {formatDate(modifiedTimestamp, MODIFIED_DATE_FORMAT)}
                    </Text>
                )}
                {modifierName && (
                    <Text
                        as="span"
                        className="bcpr-PreviewVersionBar-modifier"
                        color="textOnLightSecondary"
                        title={modifierName}
                        variant="bodySmall"
                    >
                        {modifierName}
                    </Text>
                )}
            </div>
        </div>
    );
}
