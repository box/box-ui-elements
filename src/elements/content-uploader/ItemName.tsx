import * as React from 'react';
import './ItemName.scss';

interface ItemNameProps {
    name: string;
}

const ItemName = ({ name }: ItemNameProps) => <span className="bcu-item-label">{name}</span>;

export default ItemName;
