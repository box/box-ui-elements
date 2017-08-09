/**
 * @flow
 * @file Content sub header component
 * @author Box
 */

import React from 'react';
import SubHeaderLeft from './SubHeaderLeft';
import SubHeaderRight from './SubHeaderRight';
import type { View, Collection } from '../../flowTypes';
import './SubHeader.scss';

type Props = {
    rootId: string,
    rootName?: string,
    onItemClick: Function,
    onSortChange: Function,
    getLocalizedMessage: Function,
    currentCollection: Collection,
    onUpload: Function,
    onCreate: Function,
    canUpload?: boolean,
    view: View,
    isSmall: boolean
};

const SubHeader = (props: Props) =>
    <div className='buik-sub-header'>
        <SubHeaderLeft {...props} />
        <SubHeaderRight {...props} />
    </div>;

export default SubHeader;
