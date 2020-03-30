import * as React from 'react';
import { IntlProvider } from 'react-intl';
import messages from '../messages';
import VersionsGroup from '../VersionsGroup';
import VersionsMenu from '../VersionsMenu';

jest.unmock('react-intl');

describe('elements/content-sidebar/versions/VersionsMenu', () => {
    const defaultDate = '2019-06-20T20:00:00.000Z';
    const defaultDateMs = new Date(defaultDate).valueOf();
    const defaultVersion = {
        id: '12345',
        action: 'upload',
        created_at: new Date(defaultDate),
        modified_at: new Date(defaultDate),
        modified_by: { name: 'Test User', id: '098765' },
    };
    const getVersion = (overrides = {}) => ({ ...defaultVersion, ...overrides });
    const getWrapper = (props = {}) =>
        shallow(<VersionsMenu {...props} />, {
            wrappingComponent: wrapperProps => <IntlProvider locale="en" messages={messages} {...wrapperProps} />,
        })
            .shallow() // <Memo .../>
            .dive(); // <ul .../>
    const GlobalDate = Date;

    beforeEach(() => {
        global.Date = jest.fn(date => new GlobalDate(date || defaultDate));
        global.Date.now = () => defaultDateMs;
    });

    afterEach(() => {
        global.Date = GlobalDate;
    });

    describe('render', () => {
        test('should render version groups based on their created_at date', () => {
            const versions = [
                getVersion({ created_at: '2019-06-20T20:00:00.000Z', id: '10' }),
                getVersion({ created_at: '2019-06-20T18:00:00.000Z', id: '9' }),
                getVersion({ created_at: '2019-06-19T20:00:00.000Z', id: '8' }),
                getVersion({ created_at: '2019-06-18T20:00:00.000Z', id: '7' }),
                getVersion({ created_at: '2019-06-17T20:00:00.000Z', id: '6' }),
                getVersion({ created_at: '2019-06-16T20:00:00.000Z', id: '5' }),
                getVersion({ created_at: '2019-06-01T20:00:00.000Z', id: '4' }),
                getVersion({ created_at: '2019-05-30T20:00:00.000Z', id: '3' }),
                getVersion({ created_at: '2019-02-01T20:00:00.000Z', id: '2' }),
                getVersion({ created_at: '2018-05-01T20:00:00.000Z', id: '1' }),
            ];
            const wrapper = getWrapper({ versions });
            const groups = wrapper.find(VersionsGroup);

            expect(groups.length).toBe(9);
            expect(groups.at(0).prop('versions').length).toBe(2); // Multiple versions collapse into a group
            expect(groups.at(0).prop('heading')).toBe('Today');
            expect(groups.at(1).prop('heading')).toBe('Yesterday');
            expect(groups.at(2).prop('heading')).toBe('Tuesday');
            expect(groups.at(3).prop('heading')).toBe('Monday');
            expect(groups.at(4).prop('heading')).toBe('Last Week');
            expect(groups.at(5).prop('heading')).toBe('This Month');
            expect(groups.at(6).prop('heading')).toBe('May');
            expect(groups.at(7).prop('heading')).toBe('February');
            expect(groups.at(8).prop('heading')).toBe('2018');
        });
    });
});
