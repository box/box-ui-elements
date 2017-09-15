/**
 * @flow
 * @file Preview sidebar component
 * @author Box
 */

import React from 'react';
import DetailsSidebar from './DetailsSidebar';
import type { BoxItem } from '../../flowTypes';
import './Sidebar.scss';

type Props = {
    file?: BoxItem,
    getPreviewer: Function,
    getLocalizedMessage: Function
};

const Sidebar = ({ file, getPreviewer, getLocalizedMessage }: Props) =>
    <div className='bcpr-sidebar'>
        {!!file && <DetailsSidebar file={file} getPreviewer={getPreviewer} getLocalizedMessage={getLocalizedMessage} />}
    </div>;

export default Sidebar;
