import * as React from 'react';

import { ItemPropertiesComponent } from '../ItemProperties';

describe('features/item-details/ItemProperties', () => {
    const getWrapper = (props = {}) => shallow(<ItemPropertiesComponent {...props} />);

    test('should not render properties when not specified', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should render properties when specified', () => {
        const wrapper = getWrapper({
            archivedAt: '2014-12-12T11:04:26-08:00',
            createdAt: '2012-12-12T11:04:26-08:00',
            description: 'Hi\ntesting this link http://box.com',
            enterpriseOwner: 'Test Enterprise Owner',
            features: {
                details: {
                    archivedAt: {
                        enabled: true,
                    },
                },
            },
            modifiedAt: 1459832991883,
            owner: 'Test Owner',
            size: '3.3 KB',
            trashedAt: '2013-02-07T10:49:34-08:00',
            uploader: 'Test Uploader',
        });

        expect(wrapper).toMatchSnapshot();
    });

    [
        {
            description: 'description',
        },
        {
            description: '',
        },
    ].forEach(({ description }) => {
        test('should render editable description when onDescriptionChange is specified', () => {
            const wrapper = getWrapper({
                description,
                descriptionTextareaProps: {
                    'data-resin-target': 'description',
                },
                onDescriptionChange: () => {},
            });

            expect(wrapper).toMatchSnapshot();
        });
    });

    test('should pass classification props to ClassificationProperty when specified', () => {
        const wrapper = getWrapper({
            classificationProps: {
                openModal: () => {},
                tooltip: 'tooltip',
                value: 'value',
            },
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render readonly url when only url is specified', () => {
        const wrapper = getWrapper({ url: 'box.com' });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render editable url when url and onValidURLChange are specified', () => {
        const wrapper = getWrapper({
            onValidURLChange: () => {},
            url: 'box.com',
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render archived date when feature is enabled', () => {
        const wrapper = getWrapper({
            archivedAt: '2014-12-12T11:04:26-08:00',
            features: {
                details: {
                    archivedAt: {
                        enabled: true,
                    },
                },
            },
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render empty archived date when feature is enabled', () => {
        const wrapper = getWrapper({
            archivedAt: null,
            features: {
                details: {
                    archivedAt: {
                        enabled: true,
                    },
                },
            },
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should not render archived date when feature is disabled', () => {
        const wrapper = getWrapper({
            archivedAt: null,
            features: {
                details: {
                    archivedAt: {
                        enabled: false,
                    },
                },
            },
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should not render archived date when feature is not set', () => {
        const wrapper = getWrapper({
            archivedAt: null,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
