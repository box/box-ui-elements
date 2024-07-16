/**
 * @flow
 * @file Classification sidebar component
 * @author Box
 */

import * as React from 'react';
import getProp from 'lodash/get';
import { FormattedMessage } from 'react-intl';

import Classification, { classificationMessages, EditClassificationButton } from '../../features/classification';
import { INTERACTION_TARGET, SECTION_TARGETS } from '../common/interactionTargets';
import Collapsible from '../../components/collapsible';
import { FIELD_PERMISSIONS_CAN_UPLOAD } from '../../constants';
import type { ClassificationInfo } from './flowTypes';
import type { BoxItem } from '../../common/types/core';
import './SidebarClassification.scss';

type OnEdit = (e: SyntheticEvent<HTMLButtonElement>) => void;
type Props = {
    classification?: ClassificationInfo,
    file: BoxItem,
    onEdit?: OnEdit,
};

const SidebarClassification = ({ classification, file, onEdit }: Props) => {
    const isEditable = !!onEdit && getProp(file, FIELD_PERMISSIONS_CAN_UPLOAD, false);
    const hasClassification = !!getProp(classification, 'name');
    if (!hasClassification && !isEditable) {
        return null;
    }
    return (
        <Collapsible
            buttonProps={{
                [INTERACTION_TARGET]: SECTION_TARGETS.CLASSIFICATION,
            }}
            className="bcs-SidebarClassification"
            headerActionItems={
                isEditable ? (
                    <EditClassificationButton
                        className="bcs-SidebarClassification-edit"
                        isEditing={hasClassification}
                        onEdit={((onEdit: any): OnEdit)}
                    />
                ) : null
            }
            title={<FormattedMessage {...classificationMessages.classification} />}
        >
            <Classification {...classification} messageStyle="inline" />
        </Collapsible>
    );
};

export default SidebarClassification;
