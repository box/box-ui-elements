// @flow
import React from 'react';
import { shallow } from 'enzyme';
import { DragDropContext } from 'react-beautiful-dnd';

import draggableRowRenderer from '../draggableRowRenderer';

describe('features/virtualized-table-renderers/draggableRowRenderer', () => {
    let wrapper;
    let rowRendererParams;
    let draggableProvided;
    let draggableSnapshot;

    const getWrapper = params => shallow(<DragDropContext>{draggableRowRenderer(params)}</DragDropContext>);

    const getRenderPropWrapper = (...args) => wrapper.find('Connect(Draggable)').renderProp('children')(...args);

    beforeEach(() => {
        rowRendererParams = {
            index: 0,
            key: '0-0',
            rowData: {
                name: 'name',
                description: 'description',
            },
            style: {
                height: 52,
                left: 0,
                top: 156,
            },
        };
        draggableProvided = { draggableProps: {}, dragHandleProps: {} };
        draggableSnapshot = { isDragging: false };
        wrapper = getWrapper(rowRendererParams);
    });

    test('should wrap row in Draggable and set correct props', () => {
        expect(wrapper.find('Connect(Draggable)').props().index).toEqual(rowRendererParams.index);
        expect(wrapper.find('Connect(Draggable)').props().draggableId).toEqual(rowRendererParams.key);

        const renderPropWrapper = getRenderPropWrapper(draggableProvided, draggableSnapshot);
        expect(renderPropWrapper.props().role).toBe('row');
        expect(renderPropWrapper.props().style).toEqual(rowRendererParams.style);
        expect(renderPropWrapper.prop('aria-rowindex')).toBe(rowRendererParams.index + 1);
    });

    test('should further wrap row in Portal and set appropriate classes when being dragged', () => {
        let renderPropWrapper;

        draggableSnapshot.isDragging = false;
        renderPropWrapper = getRenderPropWrapper(draggableProvided, draggableSnapshot);
        expect(renderPropWrapper.is('Portal')).toBe(false);
        expect(renderPropWrapper.hasClass('is-dragging')).toBe(false);

        draggableSnapshot.isDragging = true;
        renderPropWrapper = getRenderPropWrapper(draggableProvided, draggableSnapshot);
        expect(renderPropWrapper.is('Portal')).toBe(true);
        expect(renderPropWrapper.props().className).toBe('bdl-VirtualizedTable bdl-DraggableVirtualizedTable');
        expect(renderPropWrapper.find('[role="row"]').hasClass('is-dragging')).toBe(true);
    });

    test('should use rowData id as draggableId when available', () => {
        delete rowRendererParams.rowData.id;
        wrapper = getWrapper(rowRendererParams);
        expect(wrapper.find('Connect(Draggable)').props().draggableId).toEqual(rowRendererParams.key);

        rowRendererParams.rowData.id = 'rowDataId';
        wrapper = getWrapper(rowRendererParams);
        expect(wrapper.find('Connect(Draggable)').props().draggableId).toEqual('rowDataId');
    });

    test('should extend row with Draggable props and give precedence to Draggable style', () => {
        draggableProvided = {
            draggableProps: {
                style: {
                    color: 'blue',
                    left: 10,
                    top: 20,
                },
                foo: 'bar',
            },
            dragHandleProps: {
                bar: 'foo',
            },
            innerRef: 'innerRef',
        };
        const renderPropWrapper = getRenderPropWrapper(draggableProvided, draggableSnapshot);

        expect(renderPropWrapper.props()).toEqual({
            'aria-rowindex': 1,
            bar: 'foo',
            children: undefined,
            className: '',
            foo: 'bar',
            role: 'row',
            style: {
                color: 'blue',
                height: 52,
                left: 10,
                top: 20,
            },
        });
    });
});
