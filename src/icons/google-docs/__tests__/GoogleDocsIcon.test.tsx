import React from 'react';
import { shallow } from 'enzyme';
import GoogleDocsIcon from '../GoogleDocsIcon';

describe('icons/google-docs/GoogleDocsIcon', () => {
    const getWrapper = (props = {}) => shallow(<GoogleDocsIcon extension="" {...props} />);

    [
        {
            extension: 'docm',
            component: 'IconGoogleDocs',
        },
        {
            extension: 'docx',
            component: 'IconGoogleDocs',
        },
        {
            extension: 'gdoc',
            component: 'IconGoogleDocs',
        },
        {
            extension: 'odt',
            component: 'IconGoogleDocs',
        },
        {
            extension: 'gsheet',
            component: 'IconGoogleSheets',
        },
        {
            extension: 'ods',
            component: 'IconGoogleSheets',
        },
        {
            extension: 'xlsm',
            component: 'IconGoogleSheets',
        },
        {
            extension: 'xlsx',
            component: 'IconGoogleSheets',
        },
        {
            extension: 'gslide',
            component: 'IconGoogleSlides',
        },
        {
            extension: 'gslides',
            component: 'IconGoogleSlides',
        },
        {
            extension: 'odp',
            component: 'IconGoogleSlides',
        },
        {
            extension: 'pptm',
            component: 'IconGoogleSlides',
        },
        {
            extension: 'pptx',
            component: 'IconGoogleSlides',
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
