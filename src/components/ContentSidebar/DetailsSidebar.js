/**
 * @flow
 * @file Details sidebar component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import getProp from 'lodash/get';
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
    onAccessStatsClick?: Function,
    onClassificationClick?: Function,
    onRetentionPolicyExtendClick?: Function,
    onDescriptionChange?: Function
};

type Props = {
    accessStats?: FileAccessStats,
    file: BoxItem,
    onDescriptionChange: Function,
    versions?: FileVersions,
    accessStatsError?: Errors,
    fileError?: Errors,
    onVersionHistoryClick?: Function
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
    onRetentionPolicyExtendClick
}: Props) => (
    <SidebarContent title={<FormattedMessage {...messages.sidebarDetailsTitle} />}>
        {(hasVersions || hasNotices) && (
            <div className='bcs-details-content'>
                {hasVersions && (
                    <SidebarVersions onVersionHistoryClick={onVersionHistoryClick} versions={versions} file={file} />
                )}
                {hasNotices && <SidebarNotices file={file} />}
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
                    onClassificationClick={
                        onClassificationClick && getProp(file, 'permissions.can_upload', false)
                            ? onClassificationClick
                            : undefined
                    }
                    hasRetentionPolicy={hasRetentionPolicy}
                    retentionPolicy={retentionPolicy}
                    onRetentionPolicyExtendClick={onRetentionPolicyExtendClick}
                />
            </SidebarSection>
        )}
        {hasAccessStats && (
            <SidebarAccessStats
                accessStats={accessStats}
                onAccessStatsClick={onAccessStatsClick}
                file={file}
                {...accessStatsError}
            />
        )}
    </SidebarContent>
);

export type DetailsSidebarProps = ExternalProps;
export default DetailsSidebar;
