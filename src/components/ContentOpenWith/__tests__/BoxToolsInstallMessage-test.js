import React from 'react';
import { shallow } from 'enzyme';
import BoxToolsInstallMessage from '../BoxToolsInstallMessage';

describe('components/ContentOpenWith/BoxToolsInstallMessage', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    const getWrapper = props => shallow(<BoxToolsInstallMessage {...props} />);

    describe('render', () => {
        it('should render a translated message with a link', () => {
            const wrapper = getWrapper({});
            expect(wrapper).toMatchSnapshot();
        });
    });
});
