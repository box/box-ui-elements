import React from 'react';
import { shallow } from 'enzyme';
import OfficeOnlineIcon from '../OfficeOnlineIcon';

describe('icons/microsoft-office/OfficeOnlineIcon', () => {
    const getWrapper = (props = {}) => shallow(<OfficeOnlineIcon extension="" {...props} />);

    [
        {
            extension: 'doc',
            component: 'IconWordOnline',
        },
        {
            extension: 'docx',
            component: 'IconWordOnline',
        },
        {
            extension: 'ppt',
            component: 'IconPowerPointOnline',
        },
        {
            extension: 'pptx',
            component: 'IconPowerPointOnline',
        },
        {
            extension: 'xls',
            component: 'IconExcelOnline',
        },
        {
            extension: 'xlsx',
            component: 'IconExcelOnline',
        },
        {
            extension: 'xlsm',
            component: 'IconExcelOnline',
        },
        {
            extension: 'xlsb',
            component: 'IconExcelOnline',
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
