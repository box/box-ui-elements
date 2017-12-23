/**
 * @flow
 * @file Component for file icon and name
 */

import React from 'react';
import FileIcon from 'box-react-ui/lib/icons/file-icon/FileIcon';
import ItemName from './ItemName';
import './IconName.scss';

type Props = {
    name: string,
    extension: string
};

const IconName = ({ name, extension }: Props) => (
    <div className='bcu-item-icon-name'>
        <div className='bcu-item-icon'>
            <FileIcon extension={extension} />
        </div>
        <div className='bcu-item-name'>
            <ItemName name={name} />
        </div>
    </div>
);

export default IconName;
