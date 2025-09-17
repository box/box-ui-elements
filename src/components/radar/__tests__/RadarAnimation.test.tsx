import * as React from 'react';
import { mount, shallow, ReactWrapper } from 'enzyme';
import RadarAnimation, { RadarAnimationProps, RadarAnimationPosition } from '../RadarAnimation';

describe('components/radar/RadarAnimation', () => {
    const renderWrapper = (props: Partial<RadarAnimationProps> & Record<string, unknown> = {}) => {
        return mount<RadarAnimation>(
            <RadarAnimation {...props}>
                <div>Hello</div>
            </RadarAnimation>,
        );
    };

    const findTetherComponent = (wrapper: ReactWrapper) => {
        return wrapper.findWhere(node => node.prop('renderTarget') && node.prop('renderElement'));
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
        const wrapper = renderWrapper({
            'data-resin-target': 'radaranimation1',
        });
        expect(wrapper.find('.radar').prop('data-resin-target')).toBe('radaranimation1');
    });

    test('should render with custom offset when provided', () => {
        const offset = '0 10px';
        const wrapper = renderWrapper({
            offset,
        });

        const tetherComponent = findTetherComponent(wrapper);
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
            const wrapper = renderWrapper({});
            const tetherComponent = findTetherComponent(wrapper);
            expect(tetherComponent.prop('enabled')).toBe(true);
        });

        test('should be shown when isShown is true', () => {
            const wrapper = renderWrapper({ isShown: true });
            const tetherComponent = findTetherComponent(wrapper);
            expect(tetherComponent.prop('enabled')).toBe(true);
        });

        test('should not be shown when isShown is false', () => {
            const wrapper = renderWrapper({ isShown: false });
            const tetherComponent = findTetherComponent(wrapper);
            expect(tetherComponent.prop('enabled')).toBe(false);
        });
    });

    describe('position instance method', () => {
        test.each([true, false])('should only position the tether when shown', isShown => {
            const positionTetherMock = jest.fn();

            const wrapper = renderWrapper({ isShown });
            // @ts-ignore: react-tether shenanigans
            wrapper.instance().tetherRef = { current: { position: positionTetherMock } };

            wrapper.instance().position();

            expect(positionTetherMock).toHaveBeenCalledTimes(isShown ? 1 : 0);
        });
    });
});
