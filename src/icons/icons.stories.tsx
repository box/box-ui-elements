import * as React from 'react';

import ItemIcon, { ItemIconProps } from './item-icon';
import ItemIconMonotone from './item-icon-monotone';
import Tooltip, { TooltipPosition } from '../components/tooltip';

const itemTypeOptions: ItemIconProps['iconType'][] = [
    'default',
    'audio',
    'bookmark',
    'boxnote',
    'code',
    'document',
    'dwg',
    'excel-spreadsheet',
    'google-docs',
    'google-sheets',
    'google-slides',
    'illustrator',
    'image',
    'indesign',
    'keynote',
    'numbers',
    'pages',
    'pdf',
    'photoshop',
    'powerpoint-presentation',
    'presentation',
    'spreadsheet',
    'text',
    'threed',
    'vector',
    'video',
    'word-document',
    'zip',
    'folder-collab',
    'folder-external',
    'folder-plain',
];

export const itemIcons = () => {
    const componentPath = select('Variant', ['icons/item-icon', 'icons/item-icon-monotone'], 'icons/item-icon');
    const Icon = { 'icons/item-icon': ItemIcon, 'icons/item-icon-monotone': ItemIconMonotone }[componentPath];
    return (
        <>
            {itemTypeOptions.map(t => (
                <span style={{ padding: 8 }} key={t}>
                    <Tooltip text={t}>
                        <span style={{ display: 'inline-block' }}>
                            <Icon iconType={t} dimension="32" />
                        </span>
                    </Tooltip>
                </span>
            ))}
            <br />
            <br />
            <div>
                <b>
                    Hover icons in grid to view the <code>iconType</code> prop
                </b>
                <p style={{ display: 'flex', alignItems: 'center', paddingTop: 16, paddingLeft: 8 }}>
                    <Tooltip text="default" isShown position={TooltipPosition.MIDDLE_RIGHT}>
                        <Icon iconType="default" dimension={32} />
                    </Tooltip>
                </p>
            </div>
        </>
    );
};

const description = `
  ItemIcon, and the solid-color variant ItemIconMonotone, are catch-all components that render the appropriate
  icon for a given file or folder type
`;

export default {
    title: 'Icons/ItemIcon',
    subcomponents: { ItemIcon, ItemIconMonotone },
    parameters: {
        componentSubtitle: description,
    },
};
