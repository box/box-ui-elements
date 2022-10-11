import React from 'react';
import Draggable from 'react-draggable';

import { DragCloudBase as DragCloud } from '../DragCloud';

const intl = {
    formatMessage: message => message.defaultMessage,
};

describe('features/security-cloud-game/DragCloud', () => {
    test('should correctly render', () => {
        const wrapper = shallow(
            <DragCloud cloudSize={100} gridTrackSize={20} intl={intl} position={{ x: 10, y: 20 }} />,
        );

        const draggable = wrapper.find(Draggable);
        expect(draggable.prop('position')).toEqual({ x: 10, y: 20 });
        expect(draggable.find('.drag-cloud').length).toEqual(1);

        const iconCloud = wrapper.find('IconCloud');
        expect(iconCloud.prop('height')).toEqual(100);
        expect(iconCloud.prop('width')).toEqual(100);
        expect(iconCloud.prop('title')).toEqual('Cloud object');
        expect(iconCloud.prop('filter')).toBeDefined();
        expect(iconCloud.prop('filter').id).toEqual('drop-shadow');
    });

    test('should handle keyboard navigation correctly', () => {
        const updatePosition = jest.fn();
        const onDrop = jest.fn();
        const updateLiveText = jest.fn();

        const wrapper = mount(
            <DragCloud
                boardHeight={500}
                boardWidth={500}
                cloudSize={50}
                gridTrackSize={10}
                intl={intl}
                onDrop={onDrop}
                position={{ x: 20, y: 10 }}
                updateLiveText={updateLiveText}
                updatePosition={updatePosition}
            />,
        );

        // grab
        wrapper.find('.drag-cloud').simulate('keydown', { key: ' ' });
        expect(wrapper.find('.drag-cloud').hasClass('drag-cloud--moving')).toBe(true);
        expect(updateLiveText).toHaveBeenLastCalledWith(
            'Cloud object grabbed. Current position: Row {row}, Column {column}.',
            true,
        );

        // move
        wrapper.find('.drag-cloud').simulate('keydown', { key: 'ArrowUp' });
        expect(updatePosition).toHaveBeenLastCalledWith({ x: 20, y: 0 }, true);
        wrapper.find('.drag-cloud').simulate('keydown', { key: 'ArrowRight' });
        expect(updatePosition).toHaveBeenLastCalledWith({ x: 30, y: 10 }, true);
        wrapper.find('.drag-cloud').simulate('keydown', { key: 'ArrowDown' });
        expect(updatePosition).toHaveBeenLastCalledWith({ x: 20, y: 20 }, true);
        wrapper.find('.drag-cloud').simulate('keydown', { key: 'ArrowLeft' });
        expect(updatePosition).toHaveBeenLastCalledWith({ x: 10, y: 10 }, true);

        // hit edge
        wrapper.setProps({ position: { x: 20, y: 0 } });
        wrapper.find('.drag-cloud').simulate('keydown', { key: 'ArrowUp' });
        expect(updateLiveText).toHaveBeenLastCalledWith('Reached top edge of grid.');

        // drop
        wrapper.find('.drag-cloud').simulate('keydown', { key: ' ' });
        expect(updateLiveText).toHaveBeenLastCalledWith(
            'Cloud object dropped. Current position: Row {row}, Column {column}.',
            true,
        );
        expect(onDrop).toHaveBeenCalledTimes(1);
        expect(wrapper.find('.drag-cloud').hasClass('drag-cloud--moving')).toBe(false);
    });

    test('should handle dragging correctly', () => {
        const updatePosition = jest.fn();
        const onDrop = jest.fn();

        const wrapper = shallow(
            <DragCloud
                boardHeight={500}
                boardWidth={500}
                cloudSize={50}
                gridTrackSize={10}
                intl={intl}
                onDrop={onDrop}
                position={{ x: 10, y: 20 }}
                updateLiveText={jest.fn()}
                updatePosition={updatePosition}
            />,
        );

        wrapper.find(Draggable).prop('onDrag')({}, { x: 50, y: 70 });
        expect(updatePosition).toHaveBeenLastCalledWith({ x: 50, y: 70 });

        wrapper.find(Draggable).prop('onStop')();
        expect(onDrop).toHaveBeenCalledTimes(1);
    });
});
