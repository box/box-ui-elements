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
    onDescriptionChange: Function,
    versions?: FileVersions,
    accessStatsError?: Errors,
    fileError?: Errors,
    versionError?: Errors,
    _internalProps: Object
};

const DetailsSidebar = ({
    accessStats,
    file,
    hasProperties,
    hasNotices,
    hasAccessStats,
    hasClassification,
    hasVersions,
    onDescriptionChange,
    versions,
    accessStatsError,
    fileError,
    versionError,
    _internalProps
}: Props) => (
    <SidebarContent title={<FormattedMessage {...messages.sidebarDetailsTitle} />}>
        {(hasVersions || hasNotices) && (
            <div className='bcs-details-content'>
                {hasVersions && (
                    <SidebarVersions
                        versions={versions}
                        file={file}
                        {...versionError}
                        _internalProps={_internalProps}
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
                    _internalProps={_internalProps}
                />
            </SidebarSection>
        )}
        {hasAccessStats && (
            <SidebarAccessStats
                accessStats={accessStats}
                file={file}
                {...accessStatsError}
                _internalProps={_internalProps}
            />
        )}
    </SidebarContent>
);

export default DetailsSidebar;
