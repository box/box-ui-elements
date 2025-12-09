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

    describe('SharedLinkAutoExpiration combinations', () => {
        test('should render SharedLinkAutoExpiration alone (1 restriction)', () => {
            const autoExpirationControls = {
                sharedLinkAutoExpiration: true,
            };
            wrapper.setProps({ controlsFormat: SHORT, controls: autoExpirationControls });
            expect(wrapper.find('SecurityControlsItem').prop('message')).toEqual(
                messages.shortSharedLinkAutoExpiration,
            );
        });

        test('should render Download + SharedLinkAutoExpiration (2 restrictions)', () => {
            const autoExpirationControls = {
                sharedLinkAutoExpiration: true,
                download: {
                    desktop: {
                        restrictManagedUsers: 'ownersCoOwners',
                    },
                },
            };
            wrapper.setProps({ controlsFormat: SHORT, controls: autoExpirationControls });
            expect(wrapper.find('SecurityControlsItem').prop('message')).toEqual(
                messages.shortDownloadSharedLinkAutoExpiration,
            );
        });

        test('should render Sharing + SharedLinkAutoExpiration (2 restrictions)', () => {
            const autoExpirationControls = {
                sharedLinkAutoExpiration: true,
                sharedLink: {
                    accessLevel: 'collabOnly',
                },
            };
            wrapper.setProps({ controlsFormat: SHORT, controls: autoExpirationControls });
            expect(wrapper.find('SecurityControlsItem').prop('message')).toEqual(
                messages.shortSharingSharedLinkAutoExpiration,
            );
        });

        test('should render App + SharedLinkAutoExpiration (2 restrictions)', () => {
            const autoExpirationControls = {
                sharedLinkAutoExpiration: true,
                app: {
                    accessLevel: 'whitelist',
                    apps: [{ displayText: 'App 1' }],
                },
            };
            wrapper.setProps({ controlsFormat: SHORT, controls: autoExpirationControls });
            expect(wrapper.find('SecurityControlsItem').prop('message')).toEqual(
                messages.shortAppSharedLinkAutoExpiration,
            );
        });

        test('should render Integration + SharedLinkAutoExpiration when shouldDisplayAppsAsIntegrations is true (2 restrictions)', () => {
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
                messages.shortIntegrationSharedLinkAutoExpiration,
            );
        });

        test('should render Sign + SharedLinkAutoExpiration (2 restrictions)', () => {
            const autoExpirationControls = {
                sharedLinkAutoExpiration: true,
                boxSignRequest: {
                    enabled: true,
                },
            };
            wrapper.setProps({ controlsFormat: SHORT, controls: autoExpirationControls });
            expect(wrapper.find('SecurityControlsItem').prop('message')).toEqual(
                messages.shortSignSharedLinkAutoExpiration,
            );
        });

        test('should render Sharing + Download + SharedLinkAutoExpiration (3 restrictions)', () => {
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
                messages.shortSharingDownloadSharedLinkAutoExpiration,
            );
        });

        test('should render Sharing + App + SharedLinkAutoExpiration (3 restrictions)', () => {
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
                messages.shortSharingAppSharedLinkAutoExpiration,
            );
        });

        test('should render Sharing + Sign + SharedLinkAutoExpiration (3 restrictions)', () => {
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
                messages.shortSharingSignSharedLinkAutoExpiration,
            );
        });

        test('should render Download + App + SharedLinkAutoExpiration (3 restrictions)', () => {
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
                messages.shortDownloadAppSharedLinkAutoExpiration,
            );
        });

        test('should render Download + Sign + SharedLinkAutoExpiration (3 restrictions)', () => {
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
                messages.shortDownloadSignSharedLinkAutoExpiration,
            );
        });

        test('should render App + Sign + SharedLinkAutoExpiration (3 restrictions)', () => {
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
            expect(wrapper.find('SecurityControlsItem').prop('message')).toEqual(
                messages.shortAppSignSharedLinkAutoExpiration,
            );
        });

        test('should render Sharing + Download + App + SharedLinkAutoExpiration (4 restrictions)', () => {
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
                messages.shortSharingDownloadAppSharedLinkAutoExpiration,
            );
        });

        test('should render Sharing + Download + Integration + SharedLinkAutoExpiration when shouldDisplayAppsAsIntegrations is true (4 restrictions)', () => {
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
                messages.shortSharingDownloadIntegrationSharedLinkAutoExpiration,
            );
        });

        test('should render Sharing + Download + Sign + SharedLinkAutoExpiration (4 restrictions)', () => {
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
                messages.shortSharingDownloadSignSharedLinkAutoExpiration,
            );
        });

        test('should render Download + App + Sign + SharedLinkAutoExpiration (4 restrictions)', () => {
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
                messages.shortDownloadAppSignSharedLinkAutoExpiration,
            );
        });

        test('should render Sharing + Download + App + Sign + SharedLinkAutoExpiration (5 restrictions)', () => {
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
                boxSignRequest: {
                    enabled: true,
                },
            };
            wrapper.setProps({ controlsFormat: SHORT, controls: autoExpirationControls });
            expect(wrapper.find('SecurityControlsItem').prop('message')).toEqual(
                messages.shortSharingDownloadAppSignSharedLinkAutoExpiration,
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
                    node.prop('message').id === 'boxui.securityControls.sharedLinkAutoExpirationApplied',
            );
            expect(autoExpirationItem.exists()).toBe(true);
        });
    });
});
