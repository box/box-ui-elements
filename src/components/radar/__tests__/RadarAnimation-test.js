import React from 'react';

import RadarAnimation from '../RadarAnimation';

describe('components/radar/RadarAnimation', () => {
    const getWrapper = props =>
        shallow(
            <RadarAnimation {...props}>
                <div>Hello</div>
            </RadarAnimation>,
        );
    [
        {
            // description:
            //     'should render correctly with bottom-center positioning',
            position: 'bottom-center',
        },
        {
            // description: 'should render correctly with bottom-left positioning',
            position: 'bottom-left',
        },
        {
            // description:
            //     'should render correctly with bottom-right positioning',
            position: 'bottom-right',
        },
        {
            // description:
            //     'should render correctly with middle-center positioning',
            position: 'middle-center',
        },
        {
            // description: 'should render correctly with middle-left positioning',
            position: 'middle-left',
        },
        {
            // description:
            //     'should render correctly with middle-right positioning',
            position: 'middle-right',
        },
        {
            // description: 'should render correctly with top-center positioning',
            position: 'top-center',
        },
        {
            // description: 'should render correctly with top-left positioning',
            position: 'top-left',
        },
        {
            // description: 'should render correctly with top-right positioning',
            position: 'top-right',
        },
    ].forEach(({ position }) => {
        test(`should render correctly with ${position} positioning`, () => {
            const wrapper = getWrapper({ position });
            expect(wrapper).toMatchSnapshot();
        });
    });
});
