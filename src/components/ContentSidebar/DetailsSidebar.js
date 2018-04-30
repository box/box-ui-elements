/**
 * @flow
 * @file Details sidebar component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';
import INTERACTION_TARGETS from '../../interactionTargets';
import SidebarAccessStats from './SidebarAccessStats';
import SidebarSection from './SidebarSection';
import SidebarContent from './SidebarContent';
import SidebarSkills from './Skills/SidebarSkills';
import SidebarVersions from './SidebarVersions';
import SidebarNotices from './SidebarNotices';
import type { FileAccessStats, BoxItem, FileVersions, Errors } from '../../flowTypes';
import './DetailsSidebar.scss';
import SidebarFileProperties from './SidebarFileProperties';

type Props = {
    accessStats?: FileAccessStats,
    file: BoxItem,
    getPreviewer: Function,
    hasTitle: boolean,
    hasSkills: boolean,
    hasNotices: boolean,
    hasProperties: boolean,
    hasMetadata: boolean,
    hasAccessStats: boolean,
    hasClassification: boolean,
    hasVersions: boolean,
    rootElement: HTMLElement,
    appElement: HTMLElement,
    onAccessStatsClick?: Function,
    onInteraction: Function,
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
    getPreviewer,
    hasTitle,
    hasSkills,
    hasProperties,
    hasNotices,
    hasMetadata,
    hasAccessStats,
    hasClassification,
    hasVersions,
    rootElement,
    appElement,
    onAccessStatsClick,
    onInteraction,
    onDescriptionChange,
    onClassificationClick,
    onVersionHistoryClick,
    versions,
    accessStatsError,
    fileError,
    versionError
}: Props) => {
    if (!hasSkills && !hasProperties && !hasMetadata && !hasAccessStats && !hasClassification && !hasNotices) {
        return null;
    }

    return (
        <SidebarContent hasTitle={hasTitle} title={<FormattedMessage {...messages.sidebarDetailsTitle} />}>
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
            {hasSkills && (
                <SidebarSkills
                    metadata={file.metadata}
                    getPreviewer={getPreviewer}
                    rootElement={rootElement}
                    appElement={appElement}
                    onInteraction={onInteraction}
                />
            )}
            {hasProperties && (
                <SidebarSection
                    interactionTarget={INTERACTION_TARGETS.SECTION.FILE_PROPERTIES}
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
};

export default DetailsSidebar;
