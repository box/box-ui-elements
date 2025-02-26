import * as React from 'react';

import IconCollections from './IconCollections';
import IconCollectionsAdd from './IconCollectionsAdd';
import IconCollectionsBolt from './IconCollectionsBolt';
import IconCollectionsFilled from './IconCollectionsFilled';
import IconCollectionsStar from './IconCollectionsStar';
import IconCollectionsStarFilled from './IconCollectionsStarFilled';

const section = {
    display: 'flex',
};

const icon = {
    display: 'flex',
    'flex-direction': 'column',
    'align-items': 'center',
    'margin-right': '20px',
};

const Icon = ({ children, name }: { children: React.ReactNode; name: string }) => {
    return (
        <div style={icon}>
            {children}
            <span>{name}</span>
        </div>
    );
};

export const allIcons = () => (
    <div style={section}>
        <Icon name="Collections">
            <IconCollections />
        </Icon>
        <Icon name="Collections Add">
            <IconCollectionsAdd />
        </Icon>
        <Icon name="Collections Bolt">
            <IconCollectionsBolt />
        </Icon>
        <Icon name="Collections Filled">
            <IconCollectionsFilled />
        </Icon>
        <Icon name="Collections Star">
            <IconCollectionsStar />
        </Icon>
        <Icon name="Collections Star Filled">
            <IconCollectionsStarFilled />
        </Icon>
    </div>
);

export default {
    title: 'Icons/Collections',
};
