import React from 'react';
import { shallow } from 'enzyme';
import Pagination from '../Pagination';

describe('features/pagination/Pagination', () => {
    test.each`
        hasNextMarker | hasPrevMarker
        ${false}      | ${false}
        ${false}      | ${true}
        ${true}       | ${false}
        ${true}       | ${true}
    `(
        'should render correctly depending on the props passed for offsetBased or markerBased pagination',
        ({ hasNextMarker, hasPrevMarker }) => {
            const wrapper = shallow(<Pagination hasNextMarker={hasNextMarker} hasPrevMarker={hasPrevMarker} />);
            expect(wrapper).toMatchSnapshot();
        },
    );

    test('should render OffsetBasedPagination when no markers are provided', () => {
        const wrapper = shallow(<Pagination offset={0} onOffsetChange={() => null} pageSize={10} totalCount={100} />);
        expect(wrapper).toMatchSnapshot();
    });
});
