import * as React from 'react';
import { shallow } from 'enzyme';

import selectors from '../../../../common/selectors/version';
import { CollapsedVersionBase as CollapsedVersion } from '../CollapsedVersion';

const translationProps = {
    intl: { formatMessage: () => {} },
};

describe('elements/content-sidebar/ActivityFeed/version/CollapsedVersion', () => {
    const render = item => shallow(<CollapsedVersion {...translationProps} {...item} />);

    beforeEach(() => {
        selectors.getVersionAction = jest.fn().mockReturnValue('upload');
    });

    test('should correctly render for single collaborator', () => {
        const version_start = 1;
        const version_end = 10;
        const item = {
            collaborators: { 1: { name: 'Person one', id: 1 } },
            version_start,
            version_end,
        };

        const wrapper = render(item);
        const formattedMessage = wrapper.find('FormattedMessage');
        expect(wrapper).toMatchSnapshot();

        const renderedVersionsMessage = shallow(formattedMessage.prop('values').versions);
        expect(renderedVersionsMessage).toMatchSnapshot();
    });

    test('should correctly render for multiple collaborators', () => {
        const version_start = 1;
        const version_end = 10;
        const item = {
            collaborators: {
                1: { name: 'Person one', id: 1 },
                2: { name: 'Person two', id: 2 },
            },
            version_start,
            version_end,
        };

        const wrapper = render(item);
        const formattedMessage = wrapper.find('FormattedMessage');

        expect(wrapper).toMatchSnapshot();

        const renderedVersionsMessage = shallow(formattedMessage.prop('values').versions);
        expect(renderedVersionsMessage).toMatchSnapshot();
    });

    test('should correctly render info icon if onInfo is passed', () => {
        const item = {
            onInfo: () => {},
            collaborators: {
                1: { name: 'Person one', id: 1 },
                2: { name: 'Person two', id: 2 },
            },
            version_start: 1,
            version_end: 10,
        };

        const wrapper = render(item);

        expect(wrapper.find('IconInfoInverted').length).toBe(1);
    });

    test('should not render a message if action is not upload', () => {
        selectors.getVersionAction.mockReturnValueOnce('delete');

        const item = {
            collaborators: { 1: { name: 'Person one', id: 1 } },
            version_start: 1,
            version_end: 10,
        };

        const wrapper = render(item);
        const formattedMessage = wrapper.find('FormattedMessage');

        expect(formattedMessage.length).toBe(0);
    });
});
