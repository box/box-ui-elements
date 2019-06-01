/**
 * @flow
 * @file Classification sidebar component
 * @author Box
 */

import React from 'react';
import getProp from 'lodash/get';
import { FormattedMessage, injectIntl } from 'react-intl';

import Classification from '../../features/classification';
import messages from '../common/messages';
import { INTERACTION_TARGET, SECTION_TARGETS, DETAILS_TARGETS } from '../common/interactionTargets';
import Collapsible from '../../components/collapsible';
import PlainButton from '../../components/plain-button/PlainButton';
import IconEdit from '../../icons/general/IconEdit';
import { FIELD_PERMISSIONS_CAN_UPLOAD } from '../../constants';
import './SidebarClassification.scss';

type Props = {
    classification: ClassificationInfo,
    file: BoxItem,
    onEdit?: () => void,
} & InjectIntlProvidedProps;

const SidebarClassification = ({ classification, file, intl, onEdit }: Props) => {
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
            headerActionItems={
                isEditable ? (
                    <PlainButton
                        aria-label={intl.formatMessage(messages.sidebarClassificationEditBtn)}
                        className="bdl-SidebarClassification-editBtn"
                        data-resin-target={DETAILS_TARGETS.CLASSIFICATION_EDIT}
                        onClick={onEdit}
                        type="button"
                    >
                        <IconEdit />
                    </PlainButton>
                ) : null
            }
            title={<FormattedMessage {...messages.sidebarClassification} />}
        >
            <Classification {...classification} />
        </Collapsible>
    );
};

export { SidebarClassification as SidebarClassificationComponent };
export default injectIntl(SidebarClassification);
