/**
 * @flow
 * @file Component for the details for the item name
 * @author Box
 */

import React from 'react';
import Breadcrumbs from './Breadcrumbs';
import { DELIMITER_SLASH } from '../../constants';
import type { BoxItem } from '../../flowTypes';
import './InlineBreadcrumbs.scss';

type Props = {
    rootId: string,
    item: BoxItem,
    getLocalizedMessage: Function,
    onItemClick: Function
};

const InlineBreadcrumbs = ({ rootId, item, onItemClick, getLocalizedMessage }: Props) => {
    const { path_collection }: BoxItem = item;
    const { entries: breadcrumbs = [] } = path_collection || {};
    return (
        <span className='buik-inline-breadcrumbs'>
            {getLocalizedMessage('buik.folder.path.prefix')}
            &nbsp;
            <Breadcrumbs rootId={rootId} crumbs={breadcrumbs} onCrumbClick={onItemClick} delimiter={DELIMITER_SLASH} />
        </span>
    );
};

export default InlineBreadcrumbs;
