import React from 'react';
import { shallow } from 'enzyme';

import IWorkDesktopIcon from '../IWorkDesktopIcon';

describe('icons/iwork/IWorkDesktopIcon', () => {
    const getWrapper = (props = {}) => shallow(<IWorkDesktopIcon extension="" {...props} />);

    [
        {
            extension: 'pages',
            component: 'PagesForMac32',
        },
        {
            extension: 'numbers',
            component: 'NumbersForMac32',
        },
        {
            extension: 'key',
            component: 'KeynoteForMac32',
        },
    ].forEach(({ extension, component }) => {
        test('should correctly render default icon', () => {
            const wrapper = getWrapper({ extension });

            expect(wrapper.is(component)).toBe(true);
            expect(wrapper.prop('height')).toEqual(32);
            expect(wrapper.prop('width')).toEqual(32);
        });

        test('should set class when specified', () => {
            const wrapper = getWrapper({ className: 'test', extension });

            expect(wrapper.hasClass('test')).toBe(true);
        });

        test('should set dimensions when specified', () => {
            const wrapper = getWrapper({ dimension: 10, extension });

            expect(wrapper.prop('height')).toEqual(10);
            expect(wrapper.prop('width')).toEqual(10);
        });

        test('should set title when specified', () => {
            const wrapper = getWrapper({ extension, title: 'title' });

            expect(wrapper.prop('title')).toEqual('title');
        });
    });

    test('should return null when extension does not match', () => {
        const wrapper = getWrapper();
        expect(wrapper.getElement()).toBeNull();
    });
});
