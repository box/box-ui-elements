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

type Props = {
    accessStats?: FileAccessStats,
    file: BoxItem,
    hasNotices: boolean,
    hasProperties: boolean,
    hasAccessStats: boolean,
    hasClassification: boolean,
    hasVersions: boolean,
    onAccessStatsClick?: Function,
    onDescriptionChange: Function,
    onClassificationClick?: Function,
    onVersionHistoryClick?: Function,
    versions?: FileVersions,
    accessStatsError?: Errors,
    fileError?: Errors,
    versionError?: Errors
};

const DetailsSidebar = ({
    accessStats,
    file,
    hasProperties,
    hasNotices,
    hasAccessStats,
    hasClassification,
    hasVersions,
    onAccessStatsClick,
    onDescriptionChange,
    onClassificationClick,
    onVersionHistoryClick,
    versions,
    accessStatsError,
    fileError,
    versionError
}: Props) => (
    <SidebarContent title={<FormattedMessage {...messages.sidebarDetailsTitle} />}>
        {(hasVersions || hasNotices) && (
            <div className='bcs-details-content'>
                {hasVersions && (
                    <SidebarVersions
                        onVersionHistoryClick={onVersionHistoryClick}
                        versions={versions}
                        file={file}
                        {...versionError}
                    />
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
                    onClassificationClick={onClassificationClick}
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

export type DetailsSidebarProps = {
    hasNotices?: boolean,
    hasProperties?: boolean,
    hasAccessStats?: boolean,
    hasClassification?: boolean,
    hasVersions?: boolean,
    onAccessStatsClick?: Function,
    onClassificationClick?: Function,
    onVersionHistoryClick?: Function
};

export default DetailsSidebar;
