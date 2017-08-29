/**
 * @flow
 * @file Preview sidebar component
 * @author Box
 */

import React from 'react';
import DetailsSidebar from './DetailsSidebar';
import type { BoxItem, Cards } from '../../flowTypes';
import './Sidebar.scss';

type Props = {
    file?: BoxItem,
    metadata?: Cards,
    getLocalizedMessage: Function
};

const Sidebar = ({ file, metadata, getLocalizedMessage }: Props) =>
    <div className='bcpr-sidebar'>
        {!!file && <DetailsSidebar file={file} metadata={metadata} getLocalizedMessage={getLocalizedMessage} />}
    </div>;

export default Sidebar;
