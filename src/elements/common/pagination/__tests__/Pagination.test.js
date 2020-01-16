import React from 'react';
import { shallow } from 'enzyme';
import Pagination from '../Pagination';

describe('elements/Pagination/Pagination', () => {
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
});
