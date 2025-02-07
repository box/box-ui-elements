import * as React from 'react';
import { Text } from '@box/blueprint-web';
import './ItemName.scss';

export interface ItemNameProps {
    name: string;
}

const ItemName = ({ name }: ItemNameProps) => (
    <Text as="span" className="bcu-item-label" color="textOnLightDefault" variant="bodyDefault">
        {name}
    </Text>
);

export default ItemName;
