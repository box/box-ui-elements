// @flow
import React from 'react';
import { shallow } from 'enzyme';
import { Column } from 'react-virtualized/dist/es/Table';

import DraggableVirtualizedTable from '../DraggableVirtualizedTable';

describe('features/virtualized-table/DraggableVirtualizedTable', () => {
    let wrapper;
    let rowData;

    const getWrapper = (props = {}) =>
        shallow(
            <DraggableVirtualizedTable tableId="tableId" {...props}>
                <Column dataKey="name" label="Name" width={100} />
                <Column dataKey="description" label="Description" width={100} />
            </DraggableVirtualizedTable>,
        );

    const getRenderPropWrapper = () =>
        wrapper.find('Connect(Droppable)').renderProp('children')({ innerRef: 'innerRef' });

    beforeEach(() => {
        rowData = [
            {
                name: 'name1',
                description: 'description1',
            },
            {
                name: 'name2',
                description: 'description2',
            },
            {
                name: 'name3',
                description: 'description3',
            },
        ];
        wrapper = getWrapper({ rowData });
    });

    test('should render a DraggableVirtualizedTable', () => {
        const renderPropWrapper = getRenderPropWrapper();

        expect(wrapper).toMatchSnapshot();
        expect(renderPropWrapper).toMatchSnapshot();
        expect(wrapper.find('Connect(Droppable)').props().droppableId).toBe('tableId');
        expect(renderPropWrapper.find('VirtualizedTable')).toHaveLength(1);
        expect(renderPropWrapper.find('Column')).toHaveLength(3);
    });

    test('should render drag handle when specified', () => {
        let renderPropWrapper;

        wrapper.setProps({ shouldShowDragHandle: false });
        renderPropWrapper = getRenderPropWrapper();
        expect(renderPropWrapper.find('Column').find({ dataKey: 'dragHandle' })).toHaveLength(0);

        wrapper.setProps({ shouldShowDragHandle: true });
        renderPropWrapper = getRenderPropWrapper();
        expect(renderPropWrapper.find('Column').find({ dataKey: 'dragHandle' })).toHaveLength(1);
    });

    test('should add class name to base table when provided', () => {
        wrapper.setProps({ className: 'myClass' });
        const renderPropWrapper = getRenderPropWrapper();

        expect(renderPropWrapper.find('VirtualizedTable').props().className).toBe(
            'bdl-DraggableVirtualizedTable myClass',
        );
    });

    test('should render a drag icon when drag handle cell renderer is called', () => {
        wrapper.setProps({ className: 'myClass' });
        const renderPropWrapper = getRenderPropWrapper();
        const { cellRenderer } = renderPropWrapper
            .find('Column')
            .find({ dataKey: 'dragHandle' })
            .props();

        expect(cellRenderer()).toMatchSnapshot();
    });

    test.each`
        destinationValue | expectedDestinationIndex
        ${undefined}     | ${1}
        ${{ index: 2 }}  | ${2}
    `(
        'should call onDragEnd with source and destination indices when drag ends and destination is $destinationValue',
        ({ destinationValue, expectedDestinationIndex }) => {
            const onDragEnd = jest.fn();
            const dropResult = {
                destination: destinationValue,
                source: { index: 1 },
            };

            wrapper.setProps({ onDragEnd });
            wrapper
                .find('DragDropContext')
                .props()
                .onDragEnd(dropResult);
            expect(onDragEnd).toHaveBeenCalledTimes(1);
            expect(onDragEnd).toHaveBeenCalledWith(1, expectedDestinationIndex);
        },
    );
});
