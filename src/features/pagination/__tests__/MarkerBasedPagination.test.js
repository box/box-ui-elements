import * as React from 'react';
import { mount } from 'enzyme';
import MarkerBasedPagination from '../MarkerBasedPagination';

describe('elements/Pagination/MarkerBasedPagination', () => {
    test.each`
        hasNextMarker | hasPrevMarker
        ${false}      | ${false}
        ${false}      | ${true}
        ${true}       | ${false}
        ${true}       | ${true}
    `(
        'should render properly with offset when hasNextMarker is $hasNextMarker and hasPrevMarker is $hasPrevMarker',
        ({ hasNextMarker, hasPrevMarker }) => {
            const onMarkerBasedPageChange = jest.fn();
            const wrapper = mount(
                <MarkerBasedPagination
                    hasNextMarker={hasNextMarker}
                    hasPrevMarker={hasPrevMarker}
                    onMarkerBasedPageChange={onMarkerBasedPageChange}
                />,
            );
            expect(wrapper.find('Button').first().props()).toMatchObject({
                className: '',
                isDisabled: false,
                isLoading: false,
                type: 'submit',
            });
        },
    );

    describe('change handler', () => {
        test('should go one page forward on navigating to next page', () => {
            const onMarkerBasedPageChange = jest.fn();
            const wrapper = mount(
                <MarkerBasedPagination hasNextMarker hasPrevMarker onMarkerBasedPageChange={onMarkerBasedPageChange} />,
            );
            const buttons = wrapper.find('.btn');
            const nextButton = buttons.at(1);
            nextButton.simulate('click');
            expect(onMarkerBasedPageChange).toBeCalledWith(1);
        });
        test('should go back one page on navigating to previous page', () => {
            const onMarkerBasedPageChange = jest.fn();
            const wrapper = mount(
                <MarkerBasedPagination hasNextMarker hasPrevMarker onMarkerBasedPageChange={onMarkerBasedPageChange} />,
            );
            const buttons = wrapper.find('.btn');
            const prevButton = buttons.at(0);
            prevButton.simulate('click');
            expect(onMarkerBasedPageChange).toBeCalledWith(-1);
        });
    });
});
