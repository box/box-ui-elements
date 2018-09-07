/**
 * @flow
 * @file Details sidebar component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';
import { SECTION_TARGETS } from '../../interactionTargets';
import SidebarAccessStats from './SidebarAccessStats';
import SidebarSection from './SidebarSection';
import SidebarContent from './SidebarContent';
import SidebarVersions from './SidebarVersions';
import SidebarNotices from './SidebarNotices';
import SidebarFileProperties from './SidebarFileProperties';

import './DetailsSidebar.scss';

type ExternalProps = {
    hasNotices?: boolean,
    hasProperties?: boolean,
    hasAccessStats?: boolean,
    hasClassification?: boolean,
    hasRetentionPolicy?: boolean,
    hasVersions?: boolean,
    retentionPolicy?: Object,
    bannerPolicy?: Object,
    onAccessStatsClick?: Function,
    onClassificationClick?: Function,
    onRetentionPolicyExtendClick?: Function,
    onDescriptionChange?: Function,
};

export type Props = {
    accessStats?: FileAccessStats,
    file: BoxItem,
    onDescriptionChange: Function,
    versions?: FileVersions,
    accessStatsError?: Errors,
    fileError?: Errors,
    onVersionHistoryClick?: Function,
    isFileLoading?: boolean,
} & ExternalProps;

const DetailsSidebar = ({
    accessStats,
    file,
    hasProperties = false,
    hasNotices = false,
    hasAccessStats = false,
    hasClassification = false,
    hasRetentionPolicy = false,
    hasVersions = false,
    onAccessStatsClick,
    onDescriptionChange,
    onClassificationClick,
    onVersionHistoryClick,
    versions,
    accessStatsError,
    fileError,
    retentionPolicy,
    bannerPolicy,
    onRetentionPolicyExtendClick,
    isFileLoading,
}: Props) => (
    <SidebarContent
        title={<FormattedMessage {...messages.sidebarDetailsTitle} />}
    >
        {hasNotices && (
            <div className="bcs-details-content">
                {hasNotices && <SidebarNotices file={file} />}
            </div>
        )}
        {hasAccessStats && (
            <SidebarAccessStats
                accessStats={accessStats}
                onAccessStatsClick={onAccessStatsClick}
                file={file}
                {...accessStatsError}
            />
        )}
        {hasVersions && (
            <div className="bcs-details-content">
                {hasVersions && (
                    <SidebarVersions
                        onVersionHistoryClick={onVersionHistoryClick}
                        versions={versions}
                        file={file}
                    />
                )}
            </div>
        )}
        {hasProperties && (
            <SidebarSection
                interactionTarget={SECTION_TARGETS.FILE_PROPERTIES}
                title={<FormattedMessage {...messages.sidebarProperties} />}
            >
                <SidebarFileProperties
                    onDescriptionChange={onDescriptionChange}
                    file={file}
                    {...fileError}
                    hasClassification={hasClassification}
                    onClassificationClick={onClassificationClick}
                    hasRetentionPolicy={hasRetentionPolicy}
                    retentionPolicy={retentionPolicy}
                    bannerPolicy={bannerPolicy}
                    onRetentionPolicyExtendClick={onRetentionPolicyExtendClick}
                    isLoading={isFileLoading}
                />
            </SidebarSection>
        )}
    </SidebarContent>
);

export type DetailsSidebarProps = ExternalProps;
export default DetailsSidebar;
