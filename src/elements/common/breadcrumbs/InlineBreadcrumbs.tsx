import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Breadcrumbs from './Breadcrumbs';
import type { BoxItem } from '../../../common/types/core';
import { DELIMITER_SLASH } from '../../../constants';

import './InlineBreadcrumbs.scss';

import messages from '../messages';

export interface InlineBreadcrumbsProps {
    item: BoxItem;
    onItemClick: (item: BoxItem | string) => void;
    rootId: string;
}

const InlineBreadcrumbs = ({ item, onItemClick, rootId }: InlineBreadcrumbsProps) => {
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
