/** @flow */
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import FolderEmptyState from '../../../icons/states/FolderEmptyState';
import MetadataEmptyState from '../../../icons/states/MetadataEmptyState';

import '../styles/MetadataListViewMessage.scss';

import messages from '../messages';

const emptyStateGraphicMapping = {
    needRefining: <MetadataEmptyState className="metadata-empty-state-graphic" />,
    tooManyResults: <MetadataEmptyState className="metadata-empty-state-graphic" />,
    noAccessForQuery: <FolderEmptyState className="folder-empty-state-graphic" />,
    noAccessForTemplate: <FolderEmptyState className="folder-empty-state-graphic" />,
};

const emptyStateHeaderMapping = {
    needRefining: 'needRefiningHeaderText',
    tooManyResults: 'tooManyResultsHeaderText',
    noAccessForQuery: 'noResultsForQueryHeaderText',
    noAccessForTemplate: 'noResultsForTemplateHeaderText',
};

const emptyStateSubtitleMapping = {
    needRefining: 'needRefiningSubtitleText',
    tooManyResults: 'tooManyResultsSubtitleText',
    noAccessForQuery: 'noResultsForQuerySubtitleText',
    noAccessForTemplate: 'noResultsForTemplateSubtitleText',
};

type Props = {
    message: string,
};

const MetadataListViewMessage = ({ message }: Props) => {
    const emptyStateMessageHeader = emptyStateHeaderMapping[message];
    const emptyStateMessageSubtitle = emptyStateSubtitleMapping[message];

    return (
        <div className="metadata-view-header-text-container">
            <div className="message-graphic">{emptyStateGraphicMapping[message]}</div>

            <div className="message-header-text">
                <FormattedMessage {...messages[emptyStateMessageHeader]} values={{ upperFileLimit: '100,000' }} />
            </div>
            <div className="message-subtitle-text">
                <FormattedMessage {...messages[emptyStateMessageSubtitle]} />
            </div>
        </div>
    );
};

export default MetadataListViewMessage;
