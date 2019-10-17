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
        [
            {
                submitting: true,
            },
            {
                submitting: false,
            },
        ].forEach(({ submitting }) => {
            test('should render correct menu', () => {
                const sharedLinkAccessMenu = getWrapper({ submitting });
                expect(sharedLinkAccessMenu).toMatchSnapshot();
            });
        });

        test('should render tooltipContent if provided', () => {
            const sharedLinkAccessMenu = getWrapper({ tooltipContent: 'Hello, world!' });
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
