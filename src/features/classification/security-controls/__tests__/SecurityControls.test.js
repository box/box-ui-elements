import * as React from 'react';

import SecurityControlsItem from '../SecurityControlsItem';
import SecurityControls from '../SecurityControls';
import { SECURITY_CONTROLS_FORMAT } from '../../constants';
import messages from '../messages';

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
                apps: [{ displayText: 'App 1' }, { displayText: 'App 2' }],
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

    test('should render SecurityControls with Integration label when using SHORT controlsFormat and shouldDisplayAppsAsIntegrations is true', () => {
        wrapper.setProps({ controlsFormat: SHORT, shouldDisplayAppsAsIntegrations: true });
        expect(wrapper.find('SecurityControlsItem').prop('message').defaultMessage).toBe(
            'Sharing, download and integration restrictions apply',
        );
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

    test('should render SecurityControls with Integration label when SHORT_WITH_BTN controlsFormat and shouldDisplayAppsAsIntegrations is true', () => {
        wrapper.setProps({
            controlsFormat: SHORT_WITH_BTN,
            classificationName: 'internal only',
            definition: 'classification definition',
            itemName: 'welcome.pdf',
            shouldDisplayAppsAsIntegrations: true,
        });
        expect(
            wrapper
                .find('SecurityControlsModal')
                .prop('modalItems')
                .find(item => item.message.defaultMessage === 'Only select integrations are allowed: {appNames}'),
        ).toBeDefined();
    });

    test('should render SecurityControls multiple SecurityControlsItem when using FULL controlsFormat', () => {
        wrapper.setProps({ controlsFormat: FULL });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render SecurityControls with Integration label when FULL controlsFormat and shouldDisplayAppsAsIntegrations is true', () => {
        wrapper.setProps({ controlsFormat: FULL, shouldDisplayAppsAsIntegrations: true });
        expect(
            wrapper.findWhere(
                node =>
                    node.type() === 'SecurityControlsItem' &&
                    node.prop('message').defaultMessage === 'Only select integrations are allowed: {appNames}',
            ),
        ).toBeDefined();
    });

    test('should render label for security controls when shouldRenderLabel prop is set', () => {
        wrapper.setProps({ controlsFormat: SHORT });
        expect(wrapper.find('Label').length).toBe(0);

        wrapper.setProps({ controlsFormat: SHORT, shouldRenderLabel: true });
        expect(wrapper.find('Label').length).toBe(1);
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

    test('should pass tooltipMessage to SecurityControlsItem if exceeds maxAppCount', () => {
        controls.app.apps = [{ displayText: 'App 1' }, { displayText: 'App 2' }, { displayText: 'App 3' }];
        wrapper.setProps({ controlsFormat: FULL, controls, maxAppCount: 2 });

        expect(
            wrapper
                .find(SecurityControlsItem)
                .findWhere(item => item.props().message.id === 'boxui.securityControls.appDownloadWhitelistOverflow')
                .props().tooltipMessage,
        ).toEqual({
            ...messages.allAppNames,
            values: { appsList: 'App 1, App 2, App 3' },
        });
    });

    describe('AutoExpiration combinations', () => {
        test('should render AutoExpiration alone (1 restriction)', () => {
            const autoExpirationControls = {
                sharedLinkAutoExpiration: true,
            };
            wrapper.setProps({ controlsFormat: SHORT, controls: autoExpirationControls });
            expect(wrapper.find('SecurityControlsItem').prop('message')).toEqual(messages.shortAutoExpiration);
        });

        test('should render Download + AutoExpiration (2 restrictions)', () => {
            const autoExpirationControls = {
                sharedLinkAutoExpiration: true,
                download: {
                    desktop: {
                        restrictManagedUsers: 'ownersCoOwners',
                    },
                },
            };
            wrapper.setProps({ controlsFormat: SHORT, controls: autoExpirationControls });
            expect(wrapper.find('SecurityControlsItem').prop('message')).toEqual(messages.shortDownloadAutoExpiration);
        });

        test('should render Sharing + AutoExpiration (2 restrictions)', () => {
            const autoExpirationControls = {
                sharedLinkAutoExpiration: true,
                sharedLink: {
                    accessLevel: 'collabOnly',
                },
            };
            wrapper.setProps({ controlsFormat: SHORT, controls: autoExpirationControls });
            expect(wrapper.find('SecurityControlsItem').prop('message')).toEqual(messages.shortSharingAutoExpiration);
        });

        test('should render App + AutoExpiration (2 restrictions)', () => {
            const autoExpirationControls = {
                sharedLinkAutoExpiration: true,
                app: {
                    accessLevel: 'whitelist',
                    apps: [{ displayText: 'App 1' }],
                },
            };
            wrapper.setProps({ controlsFormat: SHORT, controls: autoExpirationControls });
            expect(wrapper.find('SecurityControlsItem').prop('message')).toEqual(messages.shortAppAutoExpiration);
        });

        test('should render Integration + AutoExpiration when shouldDisplayAppsAsIntegrations is true (2 restrictions)', () => {
            const autoExpirationControls = {
                sharedLinkAutoExpiration: true,
                app: {
                    accessLevel: 'whitelist',
                    apps: [{ displayText: 'App 1' }],
                },
            };
            wrapper.setProps({
                controlsFormat: SHORT,
                controls: autoExpirationControls,
                shouldDisplayAppsAsIntegrations: true,
            });
            expect(wrapper.find('SecurityControlsItem').prop('message')).toEqual(
                messages.shortIntegrationAutoExpiration,
            );
        });

        test('should render Sign + AutoExpiration (2 restrictions)', () => {
            const autoExpirationControls = {
                sharedLinkAutoExpiration: true,
                boxSignRequest: {
                    enabled: true,
                },
            };
            wrapper.setProps({ controlsFormat: SHORT, controls: autoExpirationControls });
            expect(wrapper.find('SecurityControlsItem').prop('message')).toEqual(messages.shortSignAutoExpiration);
        });

        test('should render Sharing + Download + AutoExpiration (3 restrictions)', () => {
            const autoExpirationControls = {
                sharedLinkAutoExpiration: true,
                sharedLink: {
                    accessLevel: 'collabOnly',
                },
                download: {
                    desktop: {
                        restrictManagedUsers: 'ownersCoOwners',
                    },
                },
            };
            wrapper.setProps({ controlsFormat: SHORT, controls: autoExpirationControls });
            expect(wrapper.find('SecurityControlsItem').prop('message')).toEqual(
                messages.shortSharingDownloadAutoExpiration,
            );
        });

        test('should render Sharing + App + AutoExpiration (3 restrictions)', () => {
            const autoExpirationControls = {
                sharedLinkAutoExpiration: true,
                sharedLink: {
                    accessLevel: 'collabOnly',
                },
                app: {
                    accessLevel: 'whitelist',
                    apps: [{ displayText: 'App 1' }],
                },
            };
            wrapper.setProps({ controlsFormat: SHORT, controls: autoExpirationControls });
            expect(wrapper.find('SecurityControlsItem').prop('message')).toEqual(
                messages.shortSharingAppAutoExpiration,
            );
        });

        test('should render Sharing + Sign + AutoExpiration (3 restrictions)', () => {
            const autoExpirationControls = {
                sharedLinkAutoExpiration: true,
                sharedLink: {
                    accessLevel: 'collabOnly',
                },
                boxSignRequest: {
                    enabled: true,
                },
            };
            wrapper.setProps({ controlsFormat: SHORT, controls: autoExpirationControls });
            expect(wrapper.find('SecurityControlsItem').prop('message')).toEqual(
                messages.shortSharingSignAutoExpiration,
            );
        });

        test('should render Download + App + AutoExpiration (3 restrictions)', () => {
            const autoExpirationControls = {
                sharedLinkAutoExpiration: true,
                download: {
                    desktop: {
                        restrictManagedUsers: 'ownersCoOwners',
                    },
                },
                app: {
                    accessLevel: 'whitelist',
                    apps: [{ displayText: 'App 1' }],
                },
            };
            wrapper.setProps({ controlsFormat: SHORT, controls: autoExpirationControls });
            expect(wrapper.find('SecurityControlsItem').prop('message')).toEqual(
                messages.shortDownloadAppAutoExpiration,
            );
        });

        test('should render Download + Sign + AutoExpiration (3 restrictions)', () => {
            const autoExpirationControls = {
                sharedLinkAutoExpiration: true,
                download: {
                    desktop: {
                        restrictManagedUsers: 'ownersCoOwners',
                    },
                },
                boxSignRequest: {
                    enabled: true,
                },
            };
            wrapper.setProps({ controlsFormat: SHORT, controls: autoExpirationControls });
            expect(wrapper.find('SecurityControlsItem').prop('message')).toEqual(
                messages.shortDownloadSignAutoExpiration,
            );
        });

        test('should render App + Sign + AutoExpiration (3 restrictions)', () => {
            const autoExpirationControls = {
                sharedLinkAutoExpiration: true,
                app: {
                    accessLevel: 'whitelist',
                    apps: [{ displayText: 'App 1' }],
                },
                boxSignRequest: {
                    enabled: true,
                },
            };
            wrapper.setProps({ controlsFormat: SHORT, controls: autoExpirationControls });
            expect(wrapper.find('SecurityControlsItem').prop('message')).toEqual(messages.shortAppSignAutoExpiration);
        });

        test('should render Sharing + Download + App + AutoExpiration (4 restrictions)', () => {
            const autoExpirationControls = {
                sharedLinkAutoExpiration: true,
                sharedLink: {
                    accessLevel: 'collabOnly',
                },
                download: {
                    desktop: {
                        restrictManagedUsers: 'ownersCoOwners',
                    },
                },
                app: {
                    accessLevel: 'whitelist',
                    apps: [{ displayText: 'App 1' }],
                },
            };
            wrapper.setProps({ controlsFormat: SHORT, controls: autoExpirationControls });
            expect(wrapper.find('SecurityControlsItem').prop('message')).toEqual(
                messages.shortSharingDownloadAppAutoExpiration,
            );
        });

        test('should render Sharing + Download + Integration + AutoExpiration when shouldDisplayAppsAsIntegrations is true (4 restrictions)', () => {
            const autoExpirationControls = {
                sharedLinkAutoExpiration: true,
                sharedLink: {
                    accessLevel: 'collabOnly',
                },
                download: {
                    desktop: {
                        restrictManagedUsers: 'ownersCoOwners',
                    },
                },
                app: {
                    accessLevel: 'whitelist',
                    apps: [{ displayText: 'App 1' }],
                },
            };
            wrapper.setProps({
                controlsFormat: SHORT,
                controls: autoExpirationControls,
                shouldDisplayAppsAsIntegrations: true,
            });
            expect(wrapper.find('SecurityControlsItem').prop('message')).toEqual(
                messages.shortSharingDownloadIntegrationAutoExpiration,
            );
        });

        test('should render Sharing + Download + Sign + AutoExpiration (4 restrictions)', () => {
            const autoExpirationControls = {
                sharedLinkAutoExpiration: true,
                sharedLink: {
                    accessLevel: 'collabOnly',
                },
                download: {
                    desktop: {
                        restrictManagedUsers: 'ownersCoOwners',
                    },
                },
                boxSignRequest: {
                    enabled: true,
                },
            };
            wrapper.setProps({ controlsFormat: SHORT, controls: autoExpirationControls });
            expect(wrapper.find('SecurityControlsItem').prop('message')).toEqual(
                messages.shortSharingDownloadSignAutoExpiration,
            );
        });

        test('should render Download + App + Sign + AutoExpiration (4 restrictions)', () => {
            const autoExpirationControls = {
                sharedLinkAutoExpiration: true,
                download: {
                    desktop: {
                        restrictManagedUsers: 'ownersCoOwners',
                    },
                },
                app: {
                    accessLevel: 'whitelist',
                    apps: [{ displayText: 'App 1' }],
                },
                boxSignRequest: {
                    enabled: true,
                },
            };
            wrapper.setProps({ controlsFormat: SHORT, controls: autoExpirationControls });
            expect(wrapper.find('SecurityControlsItem').prop('message')).toEqual(
                messages.shortDownloadAppSignAutoExpiration,
            );
        });

        test('should render sharedLinkAutoExpirationApplied in FULL format', () => {
            const autoExpirationControls = {
                sharedLinkAutoExpiration: true,
            };
            wrapper.setProps({ controlsFormat: FULL, controls: autoExpirationControls });
            const autoExpirationItem = wrapper.findWhere(
                node =>
                    node.type() === SecurityControlsItem &&
                    node.prop('message').id === 'boxui.securityControls.sharingAutoExpirationEnabled',
            );
            expect(autoExpirationItem.exists()).toBe(true);
        });
    });
});
