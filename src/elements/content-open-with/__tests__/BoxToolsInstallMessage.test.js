/* eslint-disable no-script-url -- javascript: payloads assert URL sanitization */
import * as React from 'react';
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

    describe('onLinkClick', () => {
        const originalOpen = window.open;

        beforeEach(() => {
            window.open = jest.fn(() => ({ opener: 'set' }));
        });

        afterEach(() => {
            window.open = originalOpen;
        });

        it('should open http(s) install URLs with noopener,noreferrer', () => {
            const wrapper = getWrapper({
                boxToolsInstallUrl: 'https://foo.com/bar',
            });
            wrapper.prop('values').boxTools.props.onClick();

            expect(window.open).toHaveBeenCalledWith('https://foo.com/bar', '_blank', 'noopener,noreferrer');
        });

        it('should not open javascript: install URLs', () => {
            const wrapper = getWrapper({
                boxToolsInstallUrl: 'javascript:alert(1)',
            });
            wrapper.prop('values').boxTools.props.onClick();

            expect(window.open).not.toHaveBeenCalled();
        });
    });
});
