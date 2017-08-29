/**
 * @flow
 * @file File Properties Card component
 * @author Box
 */

import React from 'react';
import getSize from '../../util/size';
import { getDateTime } from '../../util/date';
import type { BoxItem } from '../../flowTypes';

type Props = {
    file: BoxItem,
    getLocalizedMessage: Function
};

const FileProperties = ({ file, getLocalizedMessage }: Props) => {
    const { owned_by, created_by, created_at = '', modified_at = '', size = 0 }: BoxItem = file;
    const { name: owner = '' } = owned_by || {};
    const { name: uploader = '' } = created_by || {};
    return (
        <dl>
            <dt>
                {getLocalizedMessage('buik.item.owner')}
            </dt>
            <dd>
                {owner}
            </dd>
            <dt>
                {getLocalizedMessage('buik.item.uploader')}
            </dt>
            <dd>
                {uploader}
            </dd>
            <dt>
                {getLocalizedMessage('buik.item.created')}
            </dt>
            <dd>
                {getDateTime(created_at)}
            </dd>
            <dt>
                {getLocalizedMessage('buik.item.modified')}
            </dt>
            <dd>
                {getDateTime(modified_at)}
            </dd>
            <dt>
                {getLocalizedMessage('buik.item.size')}
            </dt>
            <dd>
                {getSize(size)}
            </dd>
        </dl>
    );
};

export default FileProperties;
