/**
 * @flow
 * @file File Keyword component
 * @author Box
 */

import React from 'react';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
// import IconCross from '../icons/IconCross';
import type { SkillDataEntry } from '../../flowTypes';
import './Keyword.scss';

type Props = {
    keyword: SkillDataEntry,
    isSelected: boolean,
    onClick: Function
};

const Keyword = ({ keyword, onClick, isSelected }: Props) =>
    <span className='buik-file-keyword'>
        <PlainButton
            className={`buik-file-keyword-word ${isSelected ? 'buik-file-keyword-selected' : ''}`}
            onClick={() => onClick(keyword)}
        >
            {keyword.text}
        </PlainButton>
    </span>;

// <PlainButton type='button' className='buik-file-keyword-delete'>
//     <IconCross color='#777' width={8} height={8} />
// </PlainButton>

export default Keyword;
