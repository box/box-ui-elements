import React from 'react';
import { shallow } from 'enzyme';
import Sidebar from '../Sidebar';

jest.mock('../../common/async-load', () => () => 'LoadableComponent');

describe('elements/content-sidebar/Sidebar', () => {
    const file = { id: 'id' };
    const getWrapper = props => shallow(<Sidebar file={file} {...props} />);

    test('should render no sidebar', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should render skills sidebar', () => {
        const wrapper = getWrapper({ hasSkills: true, selectedView: 'skills' });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render activity sidebar', () => {
        const wrapper = getWrapper({ hasActivityFeed: true, selectedView: 'activity' });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render details sidebar', () => {
        const wrapper = getWrapper({ hasDetails: true, selectedView: 'details' });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render metadata sidebar', () => {
        const wrapper = getWrapper({ hasMetadata: true, selectedView: 'metadata' });
        expect(wrapper).toMatchSnapshot();
    });
});
