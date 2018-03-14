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
import type { BoxItem } from '../../flowTypes';
import './DetailsSidebar.scss';

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

    return (
        <SidebarContent hasTitle={hasTitle} title={<FormattedMessage {...messages.sidebarDetailsTitle} />}>
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
