import React from 'react';

import SecurityControlsItem from '../SecurityControlsItem';
import SecurityControls from '../SecurityControls';
import { SECURITY_CONTROLS_FORMAT } from '../constants';

const { FULL, SHORT, SHORT_WITH_TOOLTIP } = SECURITY_CONTROLS_FORMAT;

describe('features/classification/security-controls/SecurityControls', () => {
    let wrapper;
    let accessPolicyRestrictions;

    const getWrapper = (props = {}) =>
        shallow(
            <SecurityControls
                accessPolicyRestrictions={accessPolicyRestrictions}
                format={SHORT}
                maxAppCount={3}
                tooltipPosition="middle-left"
                {...props}
            />,
        );

    beforeEach(() => {
        accessPolicyRestrictions = {
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

    test('should render null when access policy does not contain accessPolicyRestrictions', () => {
        wrapper.setProps({ accessPolicyRestrictions: {} });
        expect(wrapper.isEmptyRender()).toBe(true);
    });

    test('should render SecurityControls with single SecurityControlsItem when using SHORT format', () => {
        wrapper.setProps({ format: SHORT });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render SecurityControls with single SecurityControlsItem and tooltip items when using SHORT_WITH_TOOLTIP format', () => {
        wrapper.setProps({ format: SHORT_WITH_TOOLTIP });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render SecurityControls multiple SecurityControlsItem when using FULL format', () => {
        wrapper.setProps({ format: FULL });
        expect(wrapper).toMatchSnapshot();
    });

    test('should set summarized class when not using FULL format', () => {
        wrapper.setProps({ format: FULL });
        expect(wrapper.hasClass('bdl-SecurityControls--summarized')).toBe(false);

        wrapper.setProps({ format: SHORT });
        expect(wrapper.hasClass('bdl-SecurityControls--summarized')).toBe(true);

        wrapper.setProps({ format: SHORT_WITH_TOOLTIP });
        expect(wrapper.hasClass('bdl-SecurityControls--summarized')).toBe(true);
    });

    test('should pass tooltip position to security controls item', () => {
        wrapper.setProps({ format: SHORT, tooltipPosition: 'foo' });
        expect(wrapper.find(SecurityControlsItem).props().tooltipPosition).toBe('foo');
    });

    test('should restrict displayed app names to maxAppCount', () => {
        accessPolicyRestrictions.app.apps = [
            { displayText: 'App 1' },
            { displayText: 'App 2' },
            { displayText: 'App 3' },
            { displayText: 'App 4' },
        ];
        wrapper.setProps({ format: FULL, accessPolicyRestrictions, maxAppCount: 2 });

        expect(
            wrapper
                .find(SecurityControlsItem)
                .findWhere(item => item.props().message.id === 'boxui.securityControls.appDownloadListOverflow')
                .props().message.values,
        ).toEqual({
            appNames: 'App 1, App 2',
            remainingAppCount: 2,
        });
    });
});
