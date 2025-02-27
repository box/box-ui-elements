import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Breadcrumbs from './Breadcrumbs';
import { DELIMITER_SLASH } from '../../../constants';
import messages from '../messages';
import type { BoxItem } from '../../../common/types/core';
import './InlineBreadcrumbs.scss';

export interface InlineBreadcrumbsProps {
    item: BoxItem;
    onItemClick: (id: string) => void;
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
