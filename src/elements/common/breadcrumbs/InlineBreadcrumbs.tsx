import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';
import Breadcrumbs from './Breadcrumbs';
import { DELIMITER_SLASH } from '../../../constants';
import type { BoxItem } from '../../../common/types/core';
import './InlineBreadcrumbs.scss';

export interface InlineBreadcrumbsProps {
    item: BoxItem;
    onItemClick: (item: BoxItem) => void;
    rootId: string;
}

const InlineBreadcrumbs = ({ item, onItemClick, rootId }: InlineBreadcrumbsProps) => {
    const { path_collection }: BoxItem = item;
    const { entries: breadcrumbs = [] } = path_collection || {};
    return (
        <span className="be-inline-breadcrumbs">
            <FormattedMessage {...messages.in} />
            &nbsp;
            <Breadcrumbs
                crumbs={breadcrumbs}
                delimiter={DELIMITER_SLASH}
                onCrumbClick={crumb => {
                    // Crumbs from path_collection are already BoxItems
                    onItemClick(crumb as BoxItem);
                }}
                rootId={rootId}
            />
        </span>
    );
};

export default InlineBreadcrumbs;
