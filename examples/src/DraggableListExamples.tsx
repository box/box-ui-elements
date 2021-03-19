import React, { Component } from 'react';
import uniqueId from 'lodash/uniqueId';

import Checkbox from '../../src/components/checkbox/Checkbox';
import DraggableList from '../../src/components/draggable-list';
import DraggableListItem from '../../src/components/draggable-list/DraggableListItem';

import reorder, { ReorderListItem } from '../../src/components/draggable-list/draggable-list-utils/reorder';

import '../styles/DraggableListExamples.scss';

interface Props {
    isDraggableViaHandle?: boolean;
}

interface State {
    items: Array<ReorderListItem>;
    listId: string;
}

class DraggableListExamples extends Component<Props, State> {
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

export default DraggableListExamples;
