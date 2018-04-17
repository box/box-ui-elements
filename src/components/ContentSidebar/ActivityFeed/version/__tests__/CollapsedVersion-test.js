import * as React from 'react';
import { shallow } from 'enzyme';

import { CollapsedVersionBase as CollapsedVersion } from '../CollapsedVersion';

const translationProps = {
    intl: { formatMessage: () => {} }
};

describe('components/ContentSidebar/ActivityFeed/version/CollapsedVersion', () => {
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
        expect(wrapper).toMatchSnapshot();

        const renderedVersionsMessage = shallow(formattedMessage.prop('values').versions);
        expect(renderedVersionsMessage).toMatchSnapshot();
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

        expect(wrapper.hasClass('bcs-collapsed-version')).toBe(true);
        expect(wrapper).toMatchSnapshot();

        const renderedVersionsMessage = shallow(formattedMessage.prop('values').versions);
        expect(renderedVersionsMessage).toMatchSnapshot();
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

        expect(wrapper.hasClass('bcs-collapsed-version')).toBe(true);
        expect(formattedMessage.length).toBe(0);
    });
});
