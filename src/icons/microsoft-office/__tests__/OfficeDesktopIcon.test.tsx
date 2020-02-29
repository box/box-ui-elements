import React from 'react';
import { shallow } from 'enzyme';
import OfficeDesktopIcon from '../OfficeDesktopIcon';

describe('icons/microsoft-office/OfficeDesktopIcon', () => {
    const getWrapper = (props = {}) => shallow(<OfficeDesktopIcon extension="" {...props} />);

    [
        {
            extension: 'doc',
            component: 'IconWordDesktop',
        },
        {
            extension: 'docx',
            component: 'IconWordDesktop',
        },
        {
            extension: 'ppt',
            component: 'IconPowerPointDesktop',
        },
        {
            extension: 'pptx',
            component: 'IconPowerPointDesktop',
        },
        {
            extension: 'xls',
            component: 'IconExcelDesktop',
        },
        {
            extension: 'xlsx',
            component: 'IconExcelDesktop',
        },
        {
            extension: 'xlsm',
            component: 'IconExcelDesktop',
        },
        {
            extension: 'xlsb',
            component: 'IconExcelDesktop',
        },
    ].forEach(({ extension, component }) => {
        test('should correctly render default icon', () => {
            const wrapper = getWrapper({ extension });

            expect(wrapper.is(component)).toBe(true);
            expect(wrapper.prop('height')).toEqual(30);
            expect(wrapper.prop('width')).toEqual(30);
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
