import * as React from 'react';

import SidebarToggleButton from '..';

jest.mock('elements/common/feature-checking', () => ({
    useFeatureConfig: jest.fn(),
}));

const { useFeatureConfig } = require('elements/common/feature-checking');

const mockUseFeatureConfig = useFeatureConfig;

describe('components/sidebar-toggle-button/SidebarToggleButton', () => {
    beforeEach(() => {
        mockUseFeatureConfig.mockReturnValue({ enabled: false });
    });

    test('should render correctly as open', () => {
        const wrapper = mount(<SidebarToggleButton isOpen />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should render correctly as closed', () => {
        const wrapper = mount(<SidebarToggleButton isOpen={false} />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should have the proper class when it is collapsed', () => {
        const wrapper = mount(<SidebarToggleButton isOpen={false} />);

        expect(wrapper.find('PlainButton').hasClass('bdl-is-collapsed')).toBeTruthy();
    });

    test('should render correctly as left oriented toggle when open', () => {
        const wrapper = mount(<SidebarToggleButton direction="left" isOpen />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should render correctly as left oriented toggle when closed', () => {
        const wrapper = mount(<SidebarToggleButton direction="left" isOpen={false} />);

        expect(wrapper).toMatchSnapshot();
    });

    describe('previewModernization feature enabled', () => {
        beforeEach(() => {
            mockUseFeatureConfig.mockReturnValue({ enabled: true });
        });

        test('should render IconButton when previewModernization is enabled and sidebar is open (right direction)', () => {
            const wrapper = mount(<SidebarToggleButton isOpen />);

            expect(wrapper.find('IconButton')).toHaveLength(1);
            expect(wrapper.find('PlainButton')).toHaveLength(0);
            expect(wrapper).toMatchSnapshot();
        });

        test('should render IconButton when previewModernization is enabled and sidebar is closed (right direction)', () => {
            const wrapper = mount(<SidebarToggleButton isOpen={false} />);

            expect(wrapper.find('IconButton')).toHaveLength(1);
            expect(wrapper.find('PlainButton')).toHaveLength(0);
            expect(wrapper).toMatchSnapshot();
        });

        test('should render IconButton when previewModernization is enabled and sidebar is open (left direction)', () => {
            const wrapper = mount(<SidebarToggleButton direction="left" isOpen />);

            expect(wrapper.find('IconButton')).toHaveLength(1);
            expect(wrapper.find('PlainButton')).toHaveLength(0);
            expect(wrapper).toMatchSnapshot();
        });

        test('should render IconButton when previewModernization is enabled and sidebar is closed (left direction)', () => {
            const wrapper = mount(<SidebarToggleButton direction="left" isOpen={false} />);

            expect(wrapper.find('IconButton')).toHaveLength(1);
            expect(wrapper.find('PlainButton')).toHaveLength(0);
            expect(wrapper).toMatchSnapshot();
        });

        test('should call onClick when IconButton is clicked', () => {
            const onClick = jest.fn();
            const wrapper = mount(<SidebarToggleButton isOpen onClick={onClick} />);

            wrapper.find('IconButton').simulate('click');

            expect(onClick).toHaveBeenCalledTimes(1);
        });

        test('should render IconButton with correct props when previewModernization is enabled', () => {
            const onClick = jest.fn();
            const wrapper = mount(<SidebarToggleButton isOpen onClick={onClick} />);

            const iconButton = wrapper.find('IconButton');
            expect(iconButton.prop('size')).toBe('large');
            expect(iconButton.prop('variant')).toBe('high-contrast');
            expect(iconButton.prop('onClick')).toBe(onClick);
        });
    });
});
