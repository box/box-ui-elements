import * as React from 'react';
import { shallow } from 'enzyme/build';
import VersionsGroup, { getGroup, GROUPS } from '../VersionsGroup';

describe('elements/content-sidebar/versions/VersionsGroup', () => {
    const defaultDate = '2019-06-20T20:00:00.000Z';
    const getWrapper = (props = {}) => shallow(<VersionsGroup {...props} />);
    const GlobalDate = Date;

    beforeEach(() => {
        global.Date = jest.fn(date => new GlobalDate(date || defaultDate));
    });

    afterEach(() => {
        global.Date = GlobalDate;
    });

    describe('getGroup', () => {
        test.each`
            createdAt                     | expected
            ${'2019-06-20T20:00:00.000Z'} | ${GROUPS.TODAY}
            ${'2019-06-19T20:00:00.000Z'} | ${GROUPS.YESTERDAY}
            ${'2019-06-18T20:00:00.000Z'} | ${GROUPS.WEEKDAY}
            ${'2019-06-17T20:00:00.000Z'} | ${GROUPS.WEEKDAY}
            ${'2019-06-16T20:00:00.000Z'} | ${GROUPS.PRIOR_WEEK}
            ${'2019-06-01T20:00:00.000Z'} | ${GROUPS.THIS_MONTH}
            ${'2019-05-30T20:00:00.000Z'} | ${GROUPS.PRIOR_MONTH}
            ${'2019-02-01T20:00:00.000Z'} | ${GROUPS.PRIOR_MONTH}
            ${'2018-05-01T20:00:00.000Z'} | ${GROUPS.PRIOR_YEAR}
        `('should return $expected when called with $createdAt', ({ createdAt, expected }) => {
            expect(getGroup({ created_at: createdAt })).toEqual(expected);
        });
    });

    describe('render', () => {
        test.each(Object.values(GROUPS))('should match its snapshot when group is %s', versionGroup => {
            const wrapper = getWrapper({
                versionGroup,
                versions: [{ created_at: defaultDate }],
            });
            expect(wrapper).toMatchSnapshot();
        });
    });
});
