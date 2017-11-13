/**
 * @flow
 * @file File Properties SkillData component
 * @author Box
 */

import React from 'react';
import { FormattedMessage, FormattedTime } from 'react-intl';
import messages from '../messages';
import getSize from '../../util/size';
import DateField from '../Date';
import type { BoxItem } from '../../flowTypes';

type Props = {
    file: BoxItem,
    ensurePrivacy: boolean
};

const FileProperties = ({ file, ensurePrivacy }: Props) => {
    const { owned_by, created_by, created_at = '', modified_at = '', size = 0 }: BoxItem = file;
    const { name: owner = '' } = owned_by || {};
    const { name: uploader = '' } = created_by || {};
    const showOwner = !!owner && !ensurePrivacy;
    const showUploader = !!uploader && !ensurePrivacy;

    return (
        <dl>
            {showOwner && <FormattedMessage tagName='dt' {...messages.owner} />}
            {showOwner &&
                <dd>
                    {owner}
                </dd>}
            {showUploader && <FormattedMessage tagName='dt' {...messages.uploader} />}
            {showUploader &&
                <dd>
                    {uploader}
                </dd>}
            <FormattedMessage tagName='dt' {...messages.created} />
            <dd>
                <DateField date={created_at} relative={false} />
                ,&nbsp;
                <FormattedTime value={created_at} />
            </dd>
            <FormattedMessage tagName='dt' {...messages.modified} />
            <dd>
                <DateField date={modified_at} relative={false} />
                ,&nbsp;
                <FormattedTime value={modified_at} />
            </dd>
            <FormattedMessage tagName='dt' {...messages.size} />
            <dd>
                {getSize(size)}
            </dd>
        </dl>
    );
};

export default FileProperties;
