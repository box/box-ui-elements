import * as React from 'react';
import DraggableList from '../../../examples/src/DraggableListExamples';
import notes from './DraggableList.stories.md';

export const example = () => {
    const isDraggableViaHandle = true;
    return <DraggableList isDraggableViaHandle={isDraggableViaHandle} />;
};

export default {
    title: 'Components|DraggableList',
    component: DraggableList,
    parameters: {
        notes,
    },
};
