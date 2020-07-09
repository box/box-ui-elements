import React from 'react';
import { shallow } from 'enzyme';
import RadarAnimation, { RadarAnimationProps, RadarAnimationPosition } from '../RadarAnimation';

describe('components/radar/RadarAnimation', () => {
    const getWrapper = (props: {}) =>
        shallow<RadarAnimation>(
            <RadarAnimation {...props}>
                <div>Hello</div>
            </RadarAnimation>,
        );
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
            const wrapper = getWrapper({ position } as RadarAnimationProps);
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

        expect(wrapper.prop('offset')).toEqual(offset);
    });

    describe('isShown', () => {
        test('should be shown when isShown is not provided', () => {
            expect(
                getWrapper({} as RadarAnimationProps)
                    .find('.radar')
                    .exists(),
            ).toBe(true);
        });

        test('should be shown when isShown is true', () => {
            expect(
                getWrapper({ isShown: true } as RadarAnimationProps)
                    .find('.radar')
                    .exists(),
            ).toBe(true);
        });

        test('should not be shown when isShown is false', () => {
            expect(
                getWrapper({ isShown: false } as RadarAnimationProps)
                    .find('.radar')
                    .exists(),
            ).toBe(false);
        });
    });

    describe('position instance method', () => {
        test.each([true, false])('should only position the tether when shown', isShown => {
            const positionTetherMock = jest.fn();

            const wrapper = getWrapper({ isShown } as RadarAnimationProps);
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore: react-tether shenanigans
            wrapper.instance().tetherRef = { current: { position: positionTetherMock } };

            wrapper.instance().position();

            expect(positionTetherMock).toHaveBeenCalledTimes(isShown ? 1 : 0);
        });
    });
});
