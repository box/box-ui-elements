/**
 * @flow
 * @file Component for the details for the item name
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';
import Breadcrumbs from './Breadcrumbs';
import { DELIMITER_SLASH } from '../../constants';
import type { BoxItem } from '../../flowTypes';
import './InlineBreadcrumbs.scss';

type Props = {
    rootId: string,
    item: BoxItem,
    onItemClick: Function,
    rootElement: HTMLElement
};

const InlineBreadcrumbs = ({ rootId, item, onItemClick, rootElement }: Props) => {
    const { path_collection }: BoxItem = item;
    const { entries: breadcrumbs = [] } = path_collection || {};
    return (
        <span className='buik-inline-breadcrumbs'>
            <FormattedMessage {...messages.in} />
            &nbsp;
            <Breadcrumbs
                rootId={rootId}
                crumbs={breadcrumbs}
                onCrumbClick={onItemClick}
                delimiter={DELIMITER_SLASH}
                rootElement={rootElement}
            />
        </span>
    );
};

export default InlineBreadcrumbs;
