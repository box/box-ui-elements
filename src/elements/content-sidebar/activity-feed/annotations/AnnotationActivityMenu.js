// @flow
import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import DropdownMenu from '../../../../components/dropdown-menu';
import IconEllipsis from '../../../../icons/general/IconEllipsis';
import messages from './messages';
import Pencil16 from '../../../../icon/line/Pencil16';
import PlainButton from '../../../../components/plain-button';
import Trash16 from '../../../../icon/fill/Trash16';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import { bdlGray50 } from '../../../../styles/variables';
import { Menu, MenuItem } from '../../../../components/menu';

type AnnotationActivityMenuProps = {
    canDelete?: boolean,
    canEdit?: boolean,
    className?: string,
    id: string,
    isDisabled?: boolean,
    onDelete: () => void,
    onEdit: () => void,
    onMenuClose: () => void,
    onMenuOpen: () => void,
};

const AnnotationActivityMenu = ({
    canDelete,
    canEdit,
    className,
    id,
    isDisabled,
    onDelete,
    onEdit,
    onMenuClose,
    onMenuOpen,
}: AnnotationActivityMenuProps) => {
    const menuProps = {
        'data-resin-component': 'preview',
        'data-resin-feature': 'annotations',
    };

    return (
        <DropdownMenu constrainToScrollParent isRightAligned onMenuClose={onMenuClose} onMenuOpen={onMenuOpen}>
            <PlainButton
                className={classNames('bcs-AnnotationActivityMenu', className)}
                isDisabled={isDisabled}
                data-testid="annotation-activity-actions-menu"
                type="button"
            >
                <IconEllipsis color={bdlGray50} height={16} width={16} />
            </PlainButton>
            <Menu {...menuProps}>
                {canEdit && (
                    <MenuItem
                        data-resin-itemid={id}
                        data-resin-target={ACTIVITY_TARGETS.ANNOTATION_OPTIONS_EDIT}
                        data-testid="edit-annotation-activity"
                        onClick={onEdit}
                    >
                        <Pencil16 />
                        <FormattedMessage {...messages.annotationActivityEditMenuItem} />
                    </MenuItem>
                )}
                {canDelete && (
                    <MenuItem
                        data-resin-itemid={id}
                        data-resin-target={ACTIVITY_TARGETS.ANNOTATION_OPTIONS_DELETE}
                        data-testid="delete-annotation-activity"
                        onClick={onDelete}
                    >
                        <Trash16 />
                        <FormattedMessage {...messages.annotationActivityDeleteMenuItem} />
                    </MenuItem>
                )}
            </Menu>
        </DropdownMenu>
    );
};

export default AnnotationActivityMenu;
