import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import Button from '../../../components/button/Button';
import { DEFAULT_HOSTNAME_API, TYPE_FOLDER } from '../../../constants';
import {
    MOCK_ITEM_ID,
    MOCK_CONVERTED_ITEM_DATA,
    MOCK_CONVERTED_USER_DATA,
    MOCK_COLLABS_CONVERTED_RESPONSE,
} from '../../../features/unified-share-modal/utils/__mocks__/USMMocks';
import SharingModal from '../SharingModal';
import ContentSharing from '../ContentSharing';

jest.mock('../../../features/unified-share-modal/utils/convertData', () => ({
    convertCollabsResponse: jest.fn().mockReturnValue(MOCK_COLLABS_CONVERTED_RESPONSE),
    convertItemResponse: jest.fn().mockReturnValue(MOCK_CONVERTED_ITEM_DATA),
    convertUserResponse: jest.fn().mockReturnValue(MOCK_CONVERTED_USER_DATA),
}));

jest.mock('../../../api', () => {
    return jest.fn().mockImplementation(() => {
        return {
            getCollaborationsAPI: jest.fn().mockReturnValue({
                addCollaboration: jest.fn(),
            }),
            getFolderAPI: jest.fn().mockReturnValue({
                getFolderFields: jest.fn(),
            }),
            getFolderCollaborationsAPI: jest.fn().mockReturnValue({
                getCollaborations: jest.fn(),
            }),
            getUsersAPI: jest.fn().mockReturnValue({
                getUser: jest.fn(),
            }),
        };
    });
});

describe('elements/content-sharing/ContentSharing', () => {
    const customButton = <Button>Test Button</Button>;
    const getWrapper = props =>
        mount(
            <ContentSharing
                apiHost={DEFAULT_HOSTNAME_API}
                itemID={MOCK_ITEM_ID}
                itemType={TYPE_FOLDER}
                language=""
                token=""
                {...props}
            />,
        );

    test('should add an onClick function to a custom button', () => {
        let wrapper;
        act(() => {
            wrapper = getWrapper({ customButton, displayInModal: true });
        });
        wrapper.update();
        expect(wrapper.exists(Button)).toBe(true);
    });

    test('should instantiate SharingModal on button click', () => {
        let wrapper;
        act(() => {
            wrapper = getWrapper({ customButton, displayInModal: true });
        });
        wrapper.update();
        const launchButton = wrapper.find(Button);
        act(() => {
            launchButton.invoke('onClick')();
        });
        wrapper.update();
        expect(wrapper.exists(SharingModal)).toBe(true);
        expect(wrapper.exists(Button)).toBe(true);
    });

    test.each([true, false])(
        'should instantiate SharingModal automatically when no button exists and displayInModal is %s',
        ({ displayInModal }) => {
            let wrapper;
            act(() => {
                wrapper = getWrapper({ displayInModal });
            });
            wrapper.update();
            expect(wrapper.exists(SharingModal)).toBe(true);
            expect(wrapper.exists(Button)).toBe(false);
        },
    );
});
