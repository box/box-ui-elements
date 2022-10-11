import React from 'react';
import { FormattedMessage } from 'react-intl';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import DragCloud from '../DragCloud';
import DropCloud from '../DropCloud';
import { SecurityCloudGameBase as SecurityCloudGame } from '../SecurityCloudGame';

const intl = {
    formatMessage: message => message.defaultMessage,
};

const getWrapper = () => {
    let wrapper;
    act(() => {
        wrapper = mount(<SecurityCloudGame height={1000} intl={intl} width={1000} />);
    });
    wrapper.update();
    return wrapper;
};

describe('features/security-cloud-game/SecurityCloudGame', () => {
    test('should correctly render', () => {
        const wrapper = getWrapper();

        expect(wrapper.find('.box-ui-security-cloud-game').length).toEqual(1);
        expect(wrapper.find('.box-ui-security-cloud-game').prop('style')).toEqual({
            height: '1000px',
            width: '1000px',
        });
        expect(wrapper.find('.box-ui-security-cloud-game-message').length).toEqual(1);
        expect(wrapper.find(DropCloud).length).toEqual(1);
        expect(wrapper.find(DragCloud).length).toEqual(1);
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
        expect(randomSpy).toHaveBeenCalledTimes(6);
    });

    test('should render correctly on state changes', () => {
        const wrapper = getWrapper();

        // verify isOverlap
        const dropCloudPosition = wrapper.find(DropCloud).prop('position');
        act(() => {
            wrapper.find(DragCloud).prop('updatePosition')(dropCloudPosition);
        });
        wrapper.update();
        expect(wrapper.find('.drop-cloud').hasClass('is-over')).toBe(true);

        // verify isValidDrop
        act(() => {
            wrapper.find(DragCloud).prop('onDrop')();
        });
        wrapper.update();
        expect(wrapper.find(DropCloud).length).toEqual(0);
        expect(wrapper.find(DragCloud).prop('disabled')).toEqual(true);
        expect(wrapper.find(FormattedMessage).prop('id')).toEqual('boxui.securityCloudGame.success');
    });

    test('should render an instructional message when renderMessage is called', () => {
        const wrapper = getWrapper();

        expect(wrapper.find(FormattedMessage).prop('id')).toEqual('boxui.securityCloudGame.instructions');
    });

    test('should update live text when target position is included', () => {
        const wrapper = getWrapper();

        act(() => {
            wrapper.find(DragCloud).prop('updateLiveText')('Some text.', true);
        });
        wrapper.update();

        expect(wrapper.find('.live-text').text()).toEqual('Some text. Target position: Row {row}, Column {column}.');
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

        act(() => {
            wrapper.setProps({ height: 500, width: 500 });
        });
        wrapper.update();

        expect(wrapper.find(DragCloud).prop('gridTrackSize')).toEqual(gridTrackSize / 2);
        expect(wrapper.find(DragCloud).prop('cloudSize')).toEqual(cloudSize / 2);
        expect(wrapper.find(DragCloud).prop('position')).toEqual({ x: position.x / 2, y: position.y / 2 });
    });
});
