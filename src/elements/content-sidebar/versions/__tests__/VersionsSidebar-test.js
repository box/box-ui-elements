import * as React from 'react';
import { shallow } from 'enzyme/build';
import InlineError from '../../../../components/inline-error';
import VersionsSidebar from '../VersionsSidebar';
import VersionsGroup from '../VersionsGroup';

jest.mock('../../../common/nav-button', () => ({
    BackButton: () => <button type="button">Back</button>,
}));

describe('elements/content-sidebar/versions/VersionsSidebar', () => {
    const defaultDate = '2019-06-20T20:00:00.000Z';
    const getWrapper = (props = {}) => shallow(<VersionsSidebar parentName="activity" {...props} />);
    const GlobalDate = Date;

    beforeEach(() => {
        global.Date = jest.fn(date => new GlobalDate(date || defaultDate));
    });

    afterEach(() => {
        global.Date = GlobalDate;
    });

    describe('render', () => {
        test('should show the versions list if no error prop is provided', () => {
            const wrapper = getWrapper({ versions: [{ created_at: defaultDate }] });

            expect(wrapper.find(InlineError).length).toEqual(0);
            expect(wrapper.find(VersionsGroup).length).toEqual(1);
            expect(wrapper).toMatchSnapshot();
        });

        test('should show an inline error if the prop is provided', () => {
            const wrapper = getWrapper({ error: 'This is an error', versions: [] });

            expect(wrapper.find(InlineError).length).toEqual(1);
            expect(wrapper).toMatchSnapshot();
        });
    });
});
