import * as React from 'react';
import uniqueId from 'lodash/uniqueId';

import Checkbox from '../checkbox/Checkbox';
import DraggableList from './DraggableList';
import DraggableListItem from './DraggableListItem';
import reorder, { ReorderListItem } from './draggable-list-utils/reorder';

import notes from './DraggableList.stories.md';

interface Props {
    isDraggableViaHandle?: boolean;
}

interface State {
    items: Array<ReorderListItem>;
    listId: string;
}

class DraggableListExamples extends React.Component<Props, State> {
    state = {
        items: [],
        listId: '',
    };

    componentDidMount() {
        this.setState({
            items: this.getItems(10),
            listId: uniqueId(),
        });
    }

    getItems = (count: number): Array<ReorderListItem> => {
        return Array.from({ length: count }, (v, k) => k).map(k => ({
            id: uniqueId('item_'),
            label: `item ${k}`,
        }));
    };

    onDragEnd = (sourceIndex: number, destinationIndex: number) => {
        if (!destinationIndex) {
            return;
        }

        const items = reorder(this.state.items, sourceIndex, destinationIndex);

        this.setState({
            items,
        });
    };

    render() {
        const { isDraggableViaHandle } = this.props;
        const { items, listId } = this.state;

        return (
            <DraggableList className="draggable-list-example-container" listId={listId} onDragEnd={this.onDragEnd}>
                {items.map((item: ReorderListItem, index) => (
                    <DraggableListItem
                        key={`draggable-${index}`}
                        id={item.id}
                        index={index}
                        isDraggableViaHandle={isDraggableViaHandle}
                    >
                        <Checkbox label={item.label} name={item.label} />
                    </DraggableListItem>
                ))}
            </DraggableList>
        );
    }
}

export const Example = () => <DraggableListExamples />;

export const ExampleIsDraggableViaHandle = () => <DraggableListExamples isDraggableViaHandle />;

export default {
    title: 'Components|DraggableList',
    component: DraggableList,
    parameters: {
        notes,
    },
};
