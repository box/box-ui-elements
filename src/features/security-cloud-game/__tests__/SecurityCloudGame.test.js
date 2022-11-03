import React from 'react';
import { FormattedMessage } from 'react-intl';
import { mount } from 'enzyme';

import DragCloud from '../DragCloud';
import DropCloud from '../DropCloud';
import { SecurityCloudGameBase as SecurityCloudGame } from '../SecurityCloudGame';

const intl = {
    formatMessage: message => message.defaultMessage,
};

const getWrapper = () => mount(<SecurityCloudGame height={1000} intl={intl} width={1000} />);

describe('features/security-cloud-game/SecurityCloudGame', () => {
    test('should correctly render', () => {
        const wrapper = getWrapper();

        expect(wrapper.exists('.bdl-SecurityCloudGame')).toBe(true);
        expect(wrapper.find('.bdl-SecurityCloudGame').prop('style')).toEqual({
            height: '1000px',
            width: '1000px',
        });
        expect(wrapper.exists('.bdl-SecurityCloudGame-message')).toBe(true);
        expect(wrapper.exists(DropCloud)).toBe(true);
        expect(wrapper.exists(DragCloud)).toBe(true);
    });

    test('should correctly calculate cloud positions', () => {
        const randomSpy = jest.spyOn(global.Math, 'random');
        randomSpy.mockReturnValueOnce(0.1);
        randomSpy.mockReturnValueOnce(0.1);
        randomSpy.mockReturnValueOnce(0.5);
        randomSpy.mockReturnValueOnce(0.5);

        const wrapper = getWrapper();

        const dropCloud = wrapper.find(DropCloud);
        expect(dropCloud.prop('position')).toEqual({
            x: 79,
            y: 79,
        });
        const dragCloud = wrapper.find(DragCloud);
        expect(dragCloud.prop('position')).toEqual({
            x: 395,
            y: 395,
        });
    });

    test('should retry getRandomCloudPosition if overlap was found', () => {
        const randomSpy = jest.spyOn(global.Math, 'random');
        randomSpy.mockReturnValueOnce(0.1);
        randomSpy.mockReturnValueOnce(0.1);
        randomSpy.mockReturnValueOnce(0.1);
        randomSpy.mockReturnValueOnce(0.1);
        randomSpy.mockReturnValueOnce(0.5);
        randomSpy.mockReturnValueOnce(0.5);

        getWrapper();

        // Math.random() should be called 6 times (2x2 for first call, 2x1 for second)
        expect(randomSpy).toBeCalledTimes(6);
    });

    test('should render correctly on state changes', () => {
        const wrapper = getWrapper();

        // verify isOverlap
        const dropCloudPosition = wrapper.find(DropCloud).prop('position');
        wrapper.find(DragCloud).invoke('updatePosition')(dropCloudPosition);
        expect(wrapper.find('.bdl-DropCloud').hasClass('is-over')).toBe(true);

        // verify isValidDrop
        wrapper.find(DragCloud).invoke('onDrop')();
        expect(wrapper.exists(DropCloud)).toBe(false);
        expect(wrapper.find(DragCloud).prop('disabled')).toEqual(true);

        const messageElement = wrapper.find('.bdl-SecurityCloudGame-message');
        expect(messageElement.find(FormattedMessage).prop('id')).toEqual('boxui.securityCloudGame.success');
    });

    test('should render an instructional message when renderMessage is called', () => {
        const wrapper = getWrapper();
        const messageElement = wrapper.find('.bdl-SecurityCloudGame-message');

        expect(messageElement.find(FormattedMessage).prop('id')).toEqual('boxui.securityCloudGame.instructions');
    });

    test('should update live text when target position is included', () => {
        const wrapper = getWrapper();

        wrapper.find(DragCloud).invoke('updateLiveText')('Some text.', true);

        expect(wrapper.find('.bdl-SecurityCloudGame-liveText').text()).toEqual(
            'Some text. Target position: Row {row}, Column {column}.',
        );
    });

    test('should handle resize event correctly', () => {
        const randomSpy = jest.spyOn(global.Math, 'random');
        randomSpy.mockReturnValueOnce(0.1);
        randomSpy.mockReturnValueOnce(0.1);
        randomSpy.mockReturnValueOnce(0.5);
        randomSpy.mockReturnValueOnce(0.5);

        const wrapper = getWrapper();

        const gridTrackSize = wrapper.find(DragCloud).prop('gridTrackSize');
        const cloudSize = wrapper.find(DragCloud).prop('cloudSize');
        const position = wrapper.find(DragCloud).prop('position');

        wrapper.setProps({ height: 500, width: 500 });
        wrapper.update();

        expect(wrapper.find(DragCloud).prop('gridTrackSize')).toEqual(gridTrackSize / 2);
        expect(wrapper.find(DragCloud).prop('cloudSize')).toEqual(cloudSize / 2);
        expect(wrapper.find(DragCloud).prop('position')).toEqual({ x: position.x / 2, y: position.y / 2 });
    });
});
