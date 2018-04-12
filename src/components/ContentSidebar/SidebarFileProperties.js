/**
 * @flow
 * @file Sidebar file properties component
 * @author Box
 */

import React from 'react';
import getProp from 'lodash/get';
import { injectIntl } from 'react-intl';
import ItemProperties from 'box-react-ui/lib/features/item-details/ItemProperties';
import getFileSize from 'box-react-ui/lib/utils/getFileSize';
import withErrorHandling from './withErrorHandling';
import type { BoxItem } from '../../flowTypes';

type Props = {
    file: BoxItem,
    onDescriptionChange: Function,
    intl: any
};

const SidebarFileProperties = ({ file, onDescriptionChange, intl }: Props) => (
    <ItemProperties
        createdAt={file.created_at}
        description={file.description}
        modifiedAt={file.modified_at}
        owner={getProp(file, 'owned_by.name')}
        size={getFileSize(file.size, intl.locale)}
        uploader={getProp(file, 'created_by.name')}
        onDescriptionChange={getProp(file, 'permissions.can_rename') ? onDescriptionChange : undefined}
    />
);

export { SidebarFileProperties as SidebarFilePropertiesComponent };
export default injectIntl(withErrorHandling(SidebarFileProperties));
