import React from 'react';
import { shallow } from 'enzyme';
import BoxToolsInstallMessage from '../BoxToolsInstallMessage';

describe('elements/content-open-with/BoxToolsInstallMessage', () => {
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

    describe('render', () => {
        it('should use passed in name and URL if provided', () => {
            const wrapper = getWrapper({
                boxToolsName: 'a local application',
                boxToolsInstallUrl: 'https://foo.com/bar',
            });
            expect(wrapper).toMatchSnapshot();
        });
    });
});
