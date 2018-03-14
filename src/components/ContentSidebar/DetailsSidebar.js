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
import SidebarSection from './SidebarSection';
import SidebarContent from './SidebarContent';
import SidebarSkills from './Skills/SidebarSkills';
import SidebarNotices from './SidebarNotices';
import type { BoxItem } from '../../flowTypes';
import './DetailsSidebar.scss';
import { addTime } from '../../util/datetime';

const ONE_MINUTE_IN_MS = 60000;

type Props = {
    file: BoxItem,
    getPreviewer: Function,
    hasTitle: boolean,
    hasSkills: boolean,
    hasProperties: boolean,
    hasMetadata: boolean,
    hasAccessStats: boolean,
    hasClassification: boolean,
    rootElement: HTMLElement,
    appElement: HTMLElement,
    onInteraction: Function,
    onDescriptionChange: Function,
    intl: any
};

/* eslint-disable jsx-a11y/label-has-for */
const DetailsSidebar = ({
    file,
    getPreviewer,
    hasTitle,
    hasSkills,
    hasProperties,
    hasMetadata,
    hasAccessStats,
    hasClassification,
    rootElement,
    appElement,
    onInteraction,
    onDescriptionChange,
    intl
}: Props) => {
    if (!hasSkills && !hasProperties && !hasMetadata && !hasAccessStats && !hasClassification) {
        return null;
    }

    const onDescriptionChangeEditable = getProp(file, 'permissions.can_rename') ? onDescriptionChange : undefined;
    let sharedLinkExpiration = new Date(getProp(file, 'shared_link.unshared_at'));

    if (sharedLinkExpiration) {
        // One minute is added to account for dates set via a date picker.
        // These dates will actually be stored as 11:59PM the night before the item expires.
        sharedLinkExpiration = addTime(sharedLinkExpiration, ONE_MINUTE_IN_MS);
        sharedLinkExpiration = sharedLinkExpiration.toISOString();
    }

    const hasNotices = !!sharedLinkExpiration;

    return (
        <SidebarContent hasTitle={hasTitle} title={<FormattedMessage {...messages.sidebarDetailsTitle} />}>
            {hasNotices && (
                <SidebarSection>
                    <SidebarNotices sharedLinkExpiration={sharedLinkExpiration} />
                </SidebarSection>
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
        </SidebarContent>
    );
};

export default injectIntl(DetailsSidebar);
