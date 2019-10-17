import React from 'react';
import { shallow } from 'enzyme';
import ReloadNotification from '../ReloadNotification';

const getWrapper = () => shallow(<ReloadNotification />);

describe('elements/content-preview/ReloadNotification', () => {
    describe('render()', () => {
        test('should render correctly', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });
    });
});
