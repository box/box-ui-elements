import React from 'react';

import SecurityControlsItem from '../SecurityControlsItem';
import SecurityControls from '../SecurityControls';
import { SECURITY_CONTROLS_FORMAT } from '../../constants';

const { FULL, SHORT, SHORT_WITH_BTN } = SECURITY_CONTROLS_FORMAT;

describe('features/classification/security-controls/SecurityControls', () => {
    let wrapper;
    let controls;

    const getWrapper = (props = {}) =>
        shallow(<SecurityControls controls={controls} controlsFormat={SHORT} maxAppCount={3} {...props} />);

    beforeEach(() => {
        controls = {
            sharedLink: {
                accessLevel: 'collabOnly',
            },
            download: {
                desktop: {
                    restrictManagedUsers: 'ownersCoOwners',
                },
            },
            externalCollab: {
                accessLevel: 'whitelist',
            },
            app: {
                accessLevel: 'whitelist',
            },
        };
        wrapper = getWrapper();
    });

    test('should render null when access policy does not contain controls', () => {
        wrapper.setProps({ controls: {} });
        expect(wrapper.isEmptyRender()).toBe(true);
    });

    test('should render SecurityControls with single SecurityControlsItem when using SHORT controlsFormat', () => {
        wrapper.setProps({ controlsFormat: SHORT });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render SecurityControls with single SecurityControlsItem and modal items when using SHORT_WITH_BTN controlsFormat and item, classification data is provided', () => {
        wrapper.setProps({
            controlsFormat: SHORT_WITH_BTN,
            classificationName: 'internal only',
            definition: 'classification definition',
            itemName: 'welcome.pdf',
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render SecurityControls multiple SecurityControlsItem when using FULL controlsFormat', () => {
        wrapper.setProps({ controlsFormat: FULL });
        expect(wrapper).toMatchSnapshot();
    });

    test('should restrict displayed app names to maxAppCount', () => {
        controls.app.apps = [
            { displayText: 'App 1' },
            { displayText: 'App 2' },
            { displayText: 'App 3' },
            { displayText: 'App 4' },
        ];
        wrapper.setProps({ controlsFormat: FULL, controls, maxAppCount: 2 });

        expect(
            wrapper
                .find(SecurityControlsItem)
                .findWhere(item => item.props().message.id === 'boxui.securityControls.appDownloadWhitelistOverflow')
                .props().message.values,
        ).toEqual({
            appNames: 'App 1, App 2',
            remainingAppCount: 2,
        });
    });
});
