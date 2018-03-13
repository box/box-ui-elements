import React from 'react';
import { shallow } from 'enzyme';

import { CollapsedVersionBase as CollapsedVersion } from '../CollapsedVersion';

const translationProps = {
    intl: { formatMessage: () => {} }
};

describe('features/activity-feed/version/CollapsedVersion', () => {
    const render = (item) => shallow(<CollapsedVersion {...translationProps} {...item} />);

    test('should correctly render for single collaborator', () => {
        const versionStart = 1;
        const versionEnd = 10;
        const item = {
            action: 'upload',
            collaborators: { 1: { name: 'Person one', id: 1 } },
            versionStart,
            versionEnd
        };

        const wrapper = render(item);
        const formattedMessage = wrapper.find('FormattedMessage');

        expect(wrapper.hasClass('box-ui-collapsed-version')).toBe(true);
        expect(formattedMessage.length).toBe(1);
        expect(formattedMessage.prop('values').name).toBeTruthy();
        expect(formattedMessage.prop('values').versions).toBeTruthy();

        const renderedVersionsMessage = shallow(formattedMessage.prop('values').versions);
        expect(renderedVersionsMessage.hasClass('box-ui-version-range')).toBe(true);
        expect(renderedVersionsMessage.text()).toEqual(`${versionStart} - ${versionEnd}`);
    });

    test('should correctly render for multiple collaborators', () => {
        const versionStart = 1;
        const versionEnd = 10;
        const item = {
            action: 'upload',
            collaborators: {
                1: { name: 'Person one', id: 1 },
                2: { name: 'Person two', id: 2 }
            },
            versionStart,
            versionEnd
        };

        const wrapper = render(item);
        const formattedMessage = wrapper.find('FormattedMessage');

        expect(wrapper.hasClass('box-ui-collapsed-version')).toBe(true);
        expect(formattedMessage.length).toBe(1);
        expect(formattedMessage.prop('values').numberOfCollaborators).toEqual(2);
        expect(formattedMessage.prop('values').versions).toBeTruthy();

        const renderedVersionsMessage = shallow(formattedMessage.prop('values').versions);
        expect(renderedVersionsMessage.hasClass('box-ui-version-range')).toBe(true);
        expect(renderedVersionsMessage.text()).toEqual(`${versionStart} - ${versionEnd}`);
    });

    test('should correctly render info icon if onInfo is passed', () => {
        const item = {
            action: 'upload',
            onInfo: () => {},
            collaborators: {
                1: { name: 'Person one', id: 1 },
                2: { name: 'Person two', id: 2 }
            },
            versionStart: 1,
            versionEnd: 10
        };

        const wrapper = render(item);

        expect(wrapper.find('IconInfoInverted').length).toBe(1);
    });

    test('should not render a message if action is not upload', () => {
        const item = {
            action: 'delete',
            collaborators: { 1: { name: 'Person one', id: 1 } },
            versionStart: 1,
            versionEnd: 10
        };

        const wrapper = render(item);
        const formattedMessage = wrapper.find('FormattedMessage');

        expect(wrapper.hasClass('box-ui-collapsed-version')).toBe(true);
        expect(formattedMessage.length).toBe(0);
    });
});
