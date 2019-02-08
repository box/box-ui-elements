/** @flow */
import * as React from 'react';

import IconItem from '../../../icons/item-icon/ItemIcon';

import '../styles/MetadataViewCell.scss';

type Props = {
    cellData: string,
};

const IconCell = ({ cellData }: Props) => {
    return (
        <div className="cell-container">
            <IconItem height={32} width={32} iconType={cellData} />
        </div>
    );
};

export default IconCell;
