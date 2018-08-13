import React from 'react';
import { shallow } from 'enzyme';
import ReloadNotification from '../ReloadNotification';

const getWrapper = () => shallow(<ReloadNotification />);

describe('components/ContentPreview/ReloadNotification', () => {
    describe('render()', () => {
        test('should render correctly', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });
    });
});
