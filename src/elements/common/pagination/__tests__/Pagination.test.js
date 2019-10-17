import React from 'react';
import { shallow } from 'enzyme';
import Button from '../../../../components/button/Button';
import Pagination from '../Pagination';

describe('elements/Pagination/Pagination', () => {
    test.each([-5, 0, 10, 20, 75, 100])('should render properly with offset %i', offset => {
        const wrapper = shallow(<Pagination offset={offset} onChange={jest.fn()} pageSize={20} totalCount={100} />);

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
                const onChange = jest.fn();
                const wrapper = shallow(
                    <Pagination offset={offset} onChange={onChange} pageSize={20} totalCount={100} />,
                );

                const buttons = wrapper.find(Button);
                const prevButton = buttons.at(0);

                prevButton.simulate('click');

                expect(onChange).toBeCalledWith(expected);
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
                const onChange = jest.fn();
                const wrapper = shallow(
                    <Pagination offset={offset} onChange={onChange} pageSize={20} totalCount={100} />,
                );

                const buttons = wrapper.find(Button);
                const nextButton = buttons.at(1);

                nextButton.simulate('click');

                expect(onChange).toBeCalledWith(expected);
            },
        );
    });
});
