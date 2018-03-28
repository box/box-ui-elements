/**
 * @flow
 * @file Details sidebar component
 * @author Box
 */

import React from 'react';
import getProp from 'lodash/get';
import { FormattedMessage, injectIntl } from 'react-intl';
import ItemProperties from 'box-react-ui/lib/features/item-details/ItemProperties';
import getFileSize from 'box-react-ui/lib/utils/getFileSize';
import messages from '../messages';
import SidebarAccessStats from './SidebarAccessStats';
import SidebarSection from './SidebarSection';
import SidebarContent from './SidebarContent';
import SidebarSkills from './Skills/SidebarSkills';
import SidebarVersions from './SidebarVersions';
import SidebarNotices from './SidebarNotices';
import type { AccessStats, BoxItem, FileVersions } from '../../flowTypes';
import './DetailsSidebar.scss';

type Props = {
    accessStats: AccessStats,
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
    intl: any,
    onVersionHistoryClick?: Function,
    versions: FileVersions
};

/* eslint-disable jsx-a11y/label-has-for */
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
    onVersionHistoryClick,
    versions,
    intl
}: Props) => {
    if (!hasSkills && !hasProperties && !hasMetadata && !hasAccessStats && !hasClassification && !hasNotices) {
        return null;
    }

    const onDescriptionChangeEditable = getProp(file, 'permissions.can_rename') ? onDescriptionChange : undefined;

    return (
        <SidebarContent hasTitle={hasTitle} title={<FormattedMessage {...messages.sidebarDetailsTitle} />}>
            {hasVersions && <SidebarVersions onVersionHistoryClick={onVersionHistoryClick} versions={versions} />}
            {hasNotices && <SidebarNotices file={file} />}
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
                <SidebarSection title={<FormattedMessage {...messages.sidebarProperties} />}>
                    <ItemProperties
                        createdAt={file.created_at}
                        description={file.description}
                        modifiedAt={file.modified_at}
                        owner={getProp(file, 'owned_by.name')}
                        size={getFileSize(file.size, intl.locale)}
                        uploader={getProp(file, 'created_by.name')}
                        onDescriptionChange={onDescriptionChangeEditable}
                        descriptionTextareaProps={{ maxLength: '255' }}
                    />
                </SidebarSection>
            )}
            {hasAccessStats && <SidebarAccessStats accessStats={accessStats} onAccessStatsClick={onAccessStatsClick} />}
        </SidebarContent>
    );
};

export default injectIntl(DetailsSidebar);
