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
    getLocalizedMessage: Function
};

const Sidebar = ({ file, getLocalizedMessage }: Props) =>
    <div className='bcpr-sidebar'>
        {!!file && <DetailsSidebar file={file} getLocalizedMessage={getLocalizedMessage} />}
    </div>;

export default Sidebar;
