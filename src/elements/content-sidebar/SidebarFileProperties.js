/**
 * @flow
 * @file Sidebar file properties component
 * @author Box
 */

import React from 'react';
import getProp from 'lodash/get';
import { injectIntl } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';
import ItemProperties from '../../features/item-details/ItemProperties';
import LoadingIndicatorWrapper from '../../components/loading-indicator/LoadingIndicatorWrapper';
import getFileSize from '../../utils/getFileSize';
import { INTERACTION_TARGET, DETAILS_TARGETS } from '../common/interactionTargets';
import withErrorHandling from './withErrorHandling';
import type { ClassificationInfo } from './flowTypes';
import type { BoxItem } from '../../common/types/core';
import { PLACEHOLDER_USER } from '../../constants';

type Props = {
    classification?: ClassificationInfo,
    file: BoxItem,
    hasClassification: boolean,
    hasRetentionPolicy: boolean,
    isLoading: boolean,
    onDescriptionChange: Function,
    onRetentionPolicyExtendClick?: Function,
    retentionPolicy?: Object,
} & InjectIntlProvidedProps;

const SidebarFileProperties = ({
    file,
    onDescriptionChange,
    hasRetentionPolicy,
    retentionPolicy,
    onRetentionPolicyExtendClick,
    isLoading,
    intl,
}: Props) => (
    <LoadingIndicatorWrapper isLoading={isLoading}>
        <ItemProperties
            createdAt={file.content_created_at}
            description={file.description}
            descriptionTextareaProps={{
                [INTERACTION_TARGET]: DETAILS_TARGETS.DESCRIPTION,
            }}
            modifiedAt={file.content_modified_at}
            onDescriptionChange={getProp(file, 'permissions.can_rename') ? onDescriptionChange : undefined}
            owner={getProp(file, 'owned_by.name')}
            retentionPolicyProps={
                hasRetentionPolicy
                    ? {
                          ...retentionPolicy,
                          openModal: onRetentionPolicyExtendClick,
                      }
                    : {}
            }
            size={getFileSize(file.size, intl.locale)}
            // use uploader_display_name if uploaded anonymously
            uploader={
                getProp(file, 'created_by.id') === PLACEHOLDER_USER.id
                    ? getProp(file, 'uploader_display_name')
                    : getProp(file, 'created_by.name')
            }
        />
    </LoadingIndicatorWrapper>
);

export { SidebarFileProperties as SidebarFilePropertiesComponent };
export default injectIntl(withErrorHandling(SidebarFileProperties));
