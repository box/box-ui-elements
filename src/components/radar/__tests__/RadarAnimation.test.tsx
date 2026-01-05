import * as React from 'react';
import { mount, shallow } from 'enzyme';
import TetherComponent from 'react-tether';
import RadarAnimation, { RadarAnimationPosition } from '../RadarAnimation';

describe('components/radar/RadarAnimation', () => {
    const getWrapper = (props: {}) => {
        return mount<RadarAnimation>(
            <RadarAnimation {...props}>
                <div>Hello</div>
            </RadarAnimation>,
        );
    };

    [
        {
            // description:
            //     'should render correctly with bottom-center positioning',
            position: RadarAnimationPosition.BOTTOM_CENTER,
        },
        {
            // description: 'should render correctly with bottom-left positioning',
            position: RadarAnimationPosition.BOTTOM_LEFT,
        },
        {
            // description:
            //     'should render correctly with bottom-right positioning',
            position: RadarAnimationPosition.BOTTOM_RIGHT,
        },
        {
            // description:
            //     'should render correctly with middle-center positioning',
            position: RadarAnimationPosition.MIDDLE_CENTER,
        },
        {
            // description: 'should render correctly with middle-left positioning',
            position: RadarAnimationPosition.MIDDLE_LEFT,
        },
        {
            // description:
            //     'should render correctly with middle-right positioning',
            position: RadarAnimationPosition.MIDDLE_RIGHT,
        },
        {
            // description: 'should render correctly with top-center positioning',
            position: RadarAnimationPosition.TOP_CENTER,
        },
        {
            // description: 'should render correctly with top-left positioning',
            position: RadarAnimationPosition.TOP_LEFT,
        },
        {
            // description: 'should render correctly with top-right positioning',
            position: RadarAnimationPosition.TOP_RIGHT,
        },
    ].forEach(({ position }) => {
        test(`should render correctly with ${position} positioning`, () => {
            const wrapper = shallow<RadarAnimation>(
                <RadarAnimation position={position}>
                    <div>Hello</div>
                </RadarAnimation>,
            );
            expect(wrapper).toMatchSnapshot();
        });
    });

    test('should spread the rest of the props to the radar node', () => {
        const wrapper = getWrapper({
            'data-resin-target': 'radaranimation1',
        });
        expect(wrapper.find('.radar').prop('data-resin-target')).toBe('radaranimation1');
    });

    test('should render with custom offset when provided', () => {
        const offset = '0 10px';
        const wrapper = getWrapper({
            offset,
        });

        const tetherComponent = wrapper.find(TetherComponent);
        expect(tetherComponent.prop('offset')).toEqual(offset);
    });

    test('should render correctly with tetherElementClassName', () => {
        expect(
            shallow<RadarAnimation>(
                <RadarAnimation tetherElementClassName="tether-element-class-name">
                    <div>Hello</div>
                </RadarAnimation>,
            ),
        ).toMatchSnapshot();
    });

    describe('isShown', () => {
        test('should be shown when isShown is not provided', () => {
            const wrapper = getWrapper({});
            const tetherComponent = wrapper.find(TetherComponent);
            expect(tetherComponent.prop('enabled')).toBe(true);
        });

        test('should be shown when isShown is true', () => {
            const wrapper = getWrapper({ isShown: true });
            const tetherComponent = wrapper.find(TetherComponent);
            expect(tetherComponent.prop('enabled')).toBe(true);
        });

        test('should not be shown when isShown is false', () => {
            const wrapper = getWrapper({ isShown: false });
            const tetherComponent = wrapper.find(TetherComponent);
            expect(tetherComponent.prop('enabled')).toBe(false);
        });
    });

    describe('position instance method', () => {
        test.each([true, false])('should only position the tether when shown', isShown => {
            const positionTetherMock = jest.fn();

            const wrapper = getWrapper({ isShown });
            // @ts-ignore: react-tether shenanigans
            wrapper.instance().tetherRef = { current: { position: positionTetherMock } };

            wrapper.instance().position();

            expect(positionTetherMock).toHaveBeenCalledTimes(isShown ? 1 : 0);
        });
    });
});
