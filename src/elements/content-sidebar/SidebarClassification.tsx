import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Text } from '@box/blueprint-web';

import Classification, { classificationMessages, EditClassificationButton } from '../../features/classification';
import { INTERACTION_TARGET, SECTION_TARGETS } from '../common/interactionTargets';
import Collapsible from '../../components/collapsible';
import type { BoxItem } from '../../common/types/core';
import type { ClassificationInfo } from './flowTypes';

import './SidebarClassification.scss';

type Props = {
    classification?: ClassificationInfo;
    file: BoxItem;
    onEdit?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const SidebarClassification = ({ classification, file, onEdit }: Props) => {
    const hasClassification = Boolean(classification?.name);
    const isEditable = Boolean(onEdit) && Boolean(file.permissions?.can_upload);

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
                isEditable && onEdit ? (
                    <EditClassificationButton
                        className="bcs-SidebarClassification-edit"
                        isEditing={hasClassification}
                        onEdit={onEdit}
                    />
                ) : null
            }
            title={
                <Text as="span" variant="bodyDefaultBold">
                    <FormattedMessage {...classificationMessages.classification} />
                </Text>
            }
        >
            <Classification messageStyle="inline" {...(classification ?? {})} />
        </Collapsible>
    );
};

export default SidebarClassification;
