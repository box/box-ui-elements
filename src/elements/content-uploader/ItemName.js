/**
 * @flow
 * @file Item name component
 */

import * as React from 'react';
import './ItemName.scss';

type Props = {
    name: string,
};

const ItemName = ({ name }: Props) => <span className="bcu-item-label">{name}</span>;

export default ItemName;
