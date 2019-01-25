import React from 'react';

import RetentionPolicy from '../RetentionPolicy';

describe('features/item-details/RetentionPolicy', () => {
    const getWrapper = (props = {}) => shallow(<RetentionPolicy {...props} />);

    test('should render null when retentionPolicyDescription is not specified', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should not render policy expiration', () => {
        const wrapper = getWrapper({
            retentionPolicyDescription: 'Policy one',
            policyType: 'indefinite',
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render policy expiration', () => {
        const wrapper = getWrapper({
            retentionPolicyDescription: 'Policy one',
            policyType: 'finite',
            dispositionTime: 1489899991883,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render retention policy extend button', () => {
        const wrapper = getWrapper({
            retentionPolicyDescription: 'Retention',
            policyType: 'finite',
            openModal: () => {},
            dispositionTime: 1489899991883,
        });

        expect(wrapper).toMatchSnapshot();
    });
});
