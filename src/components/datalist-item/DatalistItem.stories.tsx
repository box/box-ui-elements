import * as React from 'react';

import DatalistItem from './DatalistItem';
import notes from './DatalistItem.stories.md';

export const Example = () => {
    return <DatalistItem isSelected>Text</DatalistItem>;
};

export default {
    title: 'Components/Dropdowns/ListItems/DatalistItem',
    component: DatalistItem,
    parameters: {
        notes,
    },
};
