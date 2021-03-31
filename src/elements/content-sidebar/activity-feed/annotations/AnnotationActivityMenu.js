// @flow
import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import Media from '../../../../components/media';
import messages from './messages';
import Pencil16 from '../../../../icon/line/Pencil16';
import Trash16 from '../../../../icon/fill/Trash16';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import { MenuItem } from '../../../../components/menu';

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
}: AnnotationActivityMenuProps) => (
    <Media.Menu
        className={classNames('bcs-AnnotationActivityMenu', className)}
        isDisabled={isDisabled}
        data-testid="annotation-activity-actions-menu"
        dropdownProps={{ onMenuClose, onMenuOpen }}
        menuProps={{
            'data-resin-component': 'preview',
            'data-resin-feature': 'annotations',
        }}
    >
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
    </Media.Menu>
);

export default AnnotationActivityMenu;
