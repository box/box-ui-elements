import React from 'react';
import Draggable from 'react-draggable';

import { DragCloudBase as DragCloud } from '../DragCloud';

const intl = {
    formatMessage: message => message.defaultMessage,
};

describe('features/security-cloud-game/DragCloud', () => {
    test('should correctly render', () => {
        const wrapper = shallow(
            <DragCloud
                gameBoardSize={{ height: 500, width: 500 }}
                cloudSize={100}
                gridTrackSize={20}
                intl={intl}
                position={{ x: 10, y: 20 }}
            />,
        );

        const draggable = wrapper.find(Draggable);
        expect(draggable.prop('position')).toEqual({ x: 10, y: 20 });
        expect(draggable.exists('.bdl-DragCloud')).toBe(true);

        const iconCloud = wrapper.find('IconCloud');
        expect(iconCloud.prop('height')).toEqual(100);
        expect(iconCloud.prop('width')).toEqual(100);
        expect(iconCloud.prop('title')).toEqual('Cloud object');
        expect(iconCloud.prop('filter')).toBeDefined();
        expect(iconCloud.prop('filter').id).toEqual('drop-shadow');
    });

    describe('should handle keyboard navigation correctly', () => {
        let updatePosition;
        let onDrop;
        let updateLiveText;
        let wrapper;

        beforeEach(() => {
            updatePosition = jest.fn();
            onDrop = jest.fn();
            updateLiveText = jest.fn();

            wrapper = mount(
                <DragCloud
                    gameBoardSize={{ height: 500, width: 500 }}
                    cloudSize={50}
                    gridTrackSize={10}
                    intl={intl}
                    onDrop={onDrop}
                    position={{ x: 20, y: 10 }}
                    updateLiveText={updateLiveText}
                    updatePosition={updatePosition}
                />,
            );

            // we need to grab the cloud first in order to take further actions
            wrapper.find('.bdl-DragCloud').simulate('keydown', { key: ' ' });
        });

        test('when grabbing the cloud object', () => {
            expect(wrapper.find('.bdl-DragCloud').hasClass('is-moving')).toBe(true);
            expect(updateLiveText).lastCalledWith(
                'Cloud object grabbed. Current position: Row {row}, Column {column}.',
                true,
            );
        });

        test('when moving the cloud object', () => {
            wrapper.find('.bdl-DragCloud').simulate('keydown', { key: 'ArrowUp' });
            expect(updatePosition).lastCalledWith({ x: 20, y: 0 }, true);
            wrapper.find('.bdl-DragCloud').simulate('keydown', { key: 'ArrowRight' });
            expect(updatePosition).lastCalledWith({ x: 30, y: 10 }, true);
            wrapper.find('.bdl-DragCloud').simulate('keydown', { key: 'ArrowDown' });
            expect(updatePosition).lastCalledWith({ x: 20, y: 20 }, true);
            wrapper.find('.bdl-DragCloud').simulate('keydown', { key: 'ArrowLeft' });
            expect(updatePosition).lastCalledWith({ x: 10, y: 10 }, true);
        });

        test('when hitting the board edge', () => {
            wrapper.setProps({ position: { x: 20, y: 5 } });
            wrapper.find('.bdl-DragCloud').simulate('keydown', { key: 'ArrowUp' });
            expect(updatePosition).lastCalledWith({ x: 20, y: 0 }, true);
            expect(updateLiveText).lastCalledWith('Reached top edge of grid.');

            wrapper.setProps({ position: { x: 445, y: 20 } });
            wrapper.find('.bdl-DragCloud').simulate('keydown', { key: 'ArrowRight' });
            expect(updatePosition).lastCalledWith({ x: 450, y: 20 }, true);
            expect(updateLiveText).lastCalledWith('Reached right edge of grid.');

            wrapper.setProps({ position: { x: 20, y: 445 } });
            wrapper.find('.bdl-DragCloud').simulate('keydown', { key: 'ArrowDown' });
            expect(updatePosition).lastCalledWith({ x: 20, y: 450 }, true);
            expect(updateLiveText).lastCalledWith('Reached bottom edge of grid.');

            wrapper.setProps({ position: { x: 5, y: 20 } });
            wrapper.find('.bdl-DragCloud').simulate('keydown', { key: 'ArrowLeft' });
            expect(updatePosition).lastCalledWith({ x: 0, y: 20 }, true);
            expect(updateLiveText).lastCalledWith('Reached left edge of grid.');
        });

        test('when dropping the cloud object', () => {
            wrapper.find('.bdl-DragCloud').simulate('keydown', { key: ' ' });
            expect(updateLiveText).lastCalledWith(
                'Cloud object dropped. Current position: Row {row}, Column {column}.',
                true,
            );
            expect(onDrop).toBeCalledTimes(1);
            expect(wrapper.find('.bdl-DragCloud').hasClass('is-moving')).toBe(false);
        });

        test('when losing focus', () => {
            wrapper.find('.bdl-DragCloud').simulate('blur');
            expect(wrapper.find('.bdl-DragCloud').hasClass('is-moving')).toBe(false);
        });
    });

    test('should handle dragging correctly', () => {
        const updatePosition = jest.fn();
        const onDrop = jest.fn();

        const wrapper = shallow(
            <DragCloud
                gameBoardSize={{ height: 500, width: 500 }}
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
        expect(updatePosition).lastCalledWith({ x: 50, y: 70 });

        wrapper.find(Draggable).prop('onStop')();
        expect(onDrop).toBeCalledTimes(1);
    });
});
