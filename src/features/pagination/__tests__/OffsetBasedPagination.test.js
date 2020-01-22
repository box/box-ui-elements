import React from 'react';
import { mount } from 'enzyme';
import OffsetBasedPagination from '../OffsetBasedPagination';

describe('elements/Pagination/OffsetBasedPagination', () => {
    test.each([-5, 0, 10, 20, 75, 100])('should render properly with offset %i', offset => {
        const wrapper = mount(
            <OffsetBasedPagination offset={offset} onOffsetChange={jest.fn()} pageSize={20} totalCount={100} />,
        );

        expect(wrapper).toMatchSnapshot();
    });

    describe('change handler', () => {
        test.each`
            offset | expected
            ${-5}  | ${0}
            ${0}   | ${0}
            ${10}  | ${0}
            ${20}  | ${0}
            ${75}  | ${40}
            ${100} | ${60}
        `(
            'should return new offset of $expected when previous is clicked with a starting offset of $offset',
            ({ offset, expected }) => {
                const onOffsetChange = jest.fn();
                const wrapper = mount(
                    <OffsetBasedPagination
                        offset={offset}
                        onOffsetChange={onOffsetChange}
                        pageSize={20}
                        totalCount={100}
                    />,
                );

                const buttons = wrapper.find('.btn');
                const prevButton = buttons.at(1);
                prevButton.simulate('click');
                if (prevButton.hasClass('is-disabled')) {
                    expect(onOffsetChange).toHaveBeenCalledTimes(0);
                } else {
                    expect(onOffsetChange).toBeCalledWith(expected);
                }
            },
        );

        test.each`
            offset | expected
            ${-5}  | ${20}
            ${0}   | ${20}
            ${10}  | ${20}
            ${20}  | ${40}
            ${75}  | ${80}
            ${100} | ${80}
        `(
            'should return new offset of $expected when next is clicked with a starting offset of $offset',
            ({ offset, expected }) => {
                const onOffsetChange = jest.fn();
                const wrapper = mount(
                    <OffsetBasedPagination
                        offset={offset}
                        onOffsetChange={onOffsetChange}
                        pageSize={20}
                        totalCount={100}
                    />,
                );

                const buttons = wrapper.find('.btn');
                const nextButton = buttons.at(2);
                nextButton.simulate('click');

                if (nextButton.hasClass('is-disabled')) {
                    expect(onOffsetChange).toHaveBeenCalledTimes(0);
                } else {
                    expect(onOffsetChange).toBeCalledWith(expected);
                }
            },
        );
    });
});
