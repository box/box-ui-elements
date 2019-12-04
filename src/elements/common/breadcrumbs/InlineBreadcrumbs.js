/**
 * @flow
 * @file Component for the details for the item name
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';
import Breadcrumbs from './Breadcrumbs';
import { DELIMITER_SLASH } from '../../../constants';
import type { BoxItem } from '../../../common/types/core';
import './InlineBreadcrumbs.scss';

type Props = {
    item: BoxItem,
    onItemClick: Function,
    rootId: string,
};

const InlineBreadcrumbs = ({ item, onItemClick, rootId }: Props) => {
    const { path_collection }: BoxItem = item;
    const { entries: breadcrumbs = [] } = path_collection || {};
    return (
        <span className="be-inline-breadcrumbs">
            <FormattedMessage {...messages.in} />
            &nbsp;
            <Breadcrumbs crumbs={breadcrumbs} delimiter={DELIMITER_SLASH} onCrumbClick={onItemClick} rootId={rootId} />
        </span>
    );
};

export default InlineBreadcrumbs;
