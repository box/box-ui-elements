import React from 'react';

import CascadePolicy from '../CascadePolicy';

describe('features/metadata-instance-editor/CascadePolicy', () => {
    test('should correctly render cascade policy read only mode', () => {
        const wrapper = shallow(<CascadePolicy id="fakeId" isCascadingEnabled shouldShowCascadeOptions />);
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render cascade policy in edit mode', () => {
        const wrapper = shallow(
            <CascadePolicy
                id="fakeId"
                isEditable
                isCascadingEnabled
                onCascadeToggle={jest.fn()}
                onCascadeModeChange={jest.fn()}
                shouldShowCascadeOptions
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render cascade policy in edit mode and overwrite is on', () => {
        const wrapper = shallow(
            <CascadePolicy
                id="fakeId"
                isEditable
                isCascadingEnabled
                onCascadeToggle={jest.fn()}
                onCascadeModeChange={jest.fn()}
                shouldCascadeOverwrite
                shouldShowCascadeOptions
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render cascade policy when the template is Custom Metadata', () => {
        const wrapper = shallow(
            <CascadePolicy
                canEdit
                id="fakeId"
                isEditable
                isCustomMetadata
                onCascadeToggle={jest.fn()}
                onCascadeModeChange={jest.fn()}
                shouldShowCascadeOptions
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
