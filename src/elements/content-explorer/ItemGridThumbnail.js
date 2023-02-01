// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import isThumbnailReady from './utils';
import { getIcon } from '../common/item/iconCellRenderer';
import type { BoxItem } from '../../common/types/core';
import './ItemGridThumbnail.scss';

type Props = {
    intl: IntlShape,
    item: BoxItem,
};

const ItemGridThumbnail = ({ intl, item }: Props) => {
    const { thumbnailUrl } = item;

    return (
        <div className="bce-ItemGridThumbnail">
            {thumbnailUrl && isThumbnailReady(item) ? (
                <div className="bce-ItemGridThumbnail-item" style={{ backgroundImage: `url("${thumbnailUrl}")` }} />
            ) : (
                <div className="bce-ItemGridThumbnail-item">{getIcon(intl, item, 128)}</div>
            )}
        </div>
    );
};

export default injectIntl(ItemGridThumbnail);
