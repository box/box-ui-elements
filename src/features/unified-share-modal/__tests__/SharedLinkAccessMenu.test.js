import React from 'react';

import { ANYONE_WITH_LINK, ANYONE_IN_COMPANY } from '../constants';
import SharedLinkAccessMenu from '../SharedLinkAccessMenu';

describe('features/unified-share-modal/SharedLinkAccessMenu', () => {
    const getWrapper = props =>
        shallow(
            <SharedLinkAccessMenu
                accessLevel={ANYONE_IN_COMPANY}
                changeAccessLevel={() => {}}
                classificationName="Internal"
                enterpriseName="Box"
                isDownloadAllowed
                isEditAllowed
                isPreviewAllowed
                itemType="folder"
                onDismissTooltip={() => {}}
                submitting={false}
                tooltipContent={null}
                {...props}
            />,
        );

    describe('render()', () => {
        test.each`
            submitting
            ${true}
            ${false}
        `('should render correct menu when submitting is $submitting', ({ submitting }) => {
            const sharedLinkAccessMenu = getWrapper({ submitting });
            expect(sharedLinkAccessMenu).toMatchSnapshot();
        });

        test('should render tooltipContent if provided', () => {
            const sharedLinkAccessMenu = getWrapper({ tooltipContent: 'Hello, world!' });
            expect(sharedLinkAccessMenu).toMatchSnapshot();
        });

        test('should render no access level menu items if disabled by something other than access policy', () => {
            const sharedLinkAccessMenu = getWrapper({
                allowedAccessLevels: {
                    peopleInThisItem: true,
                    peopleInYourCompany: false,
                    peopleWithTheLink: false,
                },
            });
            expect(sharedLinkAccessMenu).toMatchSnapshot();
        });

        test('should render tooltips for access level menu items if disabled by access policy', () => {
            const sharedLinkAccessMenu = getWrapper({
                accessLevelsDisabledReason: {
                    peopleInYourCompany: 'access_policy',
                    peopleWithTheLink: 'access_policy',
                },
                allowedAccessLevels: {
                    peopleInThisItem: true,
                    peopleInYourCompany: false,
                    peopleWithTheLink: false,
                },
            });
            expect(sharedLinkAccessMenu).toMatchSnapshot();
        });

        test('should render tooltips for access level menu items if disabled by malicious content', () => {
            const sharedLinkAccessMenu = getWrapper({
                accessLevelsDisabledReason: {
                    peopleInYourCompany: 'malicious_content',
                    peopleWithTheLink: 'malicious_content',
                },
                allowedAccessLevels: {
                    peopleInThisItem: true,
                    peopleInYourCompany: false,
                    peopleWithTheLink: false,
                },
            });
            expect(sharedLinkAccessMenu).toMatchSnapshot();
        });
    });

    describe('onChangeAccessLevel()', () => {
        test('should call tracking function on menu change if it is set', () => {
            const changeMenuMock = jest.fn();
            const accessLevelSpy = jest.fn();
            const sharedLinkPermissionMenu = getWrapper({
                changeAccessLevel: accessLevelSpy,
                trackingProps: {
                    onChangeSharedLinkAccessLevel: changeMenuMock,
                },
            });
            sharedLinkPermissionMenu.instance().onChangeAccessLevel(ANYONE_WITH_LINK);

            expect(changeMenuMock).toBeCalled();
            expect(accessLevelSpy).toBeCalled();
        });

        test('should not call tracking function on menu change if it is set (when accessLevel is the same value)', () => {
            const changeMenuMock = jest.fn();
            const accessLevelSpy = jest.fn();
            const sharedLinkPermissionMenu = getWrapper({
                changeAccessLevel: accessLevelSpy,
                trackingProps: {
                    onChangeSharedLinkAccessLevel: changeMenuMock,
                },
            });
            sharedLinkPermissionMenu.instance().onChangeAccessLevel(ANYONE_IN_COMPANY);

            expect(changeMenuMock).not.toBeCalled();
            expect(accessLevelSpy).not.toBeCalled();
        });
    });
});
