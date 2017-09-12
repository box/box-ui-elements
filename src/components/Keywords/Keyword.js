/**
 * @flow
 * @file File Keyword component
 * @author Box
 */

import React from 'react';
import { PlainButton } from '../Button';
// import IconCross from '../icons/IconCross';
import type { CardEntry } from '../../flowTypes';
import './Keyword.scss';

type Props = {
    keyword: CardEntry,
    onClick: Function
};

const Keyword = ({ keyword, onClick }: Props) =>
    <span className='buik-file-keyword'>
        <PlainButton className='buik-file-keyword-word' onClick={() => onClick(keyword)}>
            {keyword.text}
        </PlainButton>
    </span>;

// <PlainButton className='buik-file-keyword-delete'>
//     <IconCross color='#777' width={8} height={8} />
// </PlainButton>

export default Keyword;
