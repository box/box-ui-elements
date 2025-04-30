import * as React from 'react';

import { screen, render } from '../../../test-utils/testing-library';

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
                isCascadingEnabled
                isEditable
                onCascadeModeChange={jest.fn()}
                onCascadeToggle={jest.fn()}
                shouldShowCascadeOptions
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('should correctly render cascade policy in edit mode and overwrite is on', () => {
        const wrapper = shallow(
            <CascadePolicy
                id="fakeId"
                isCascadingEnabled
                isEditable
                onCascadeModeChange={jest.fn()}
                onCascadeToggle={jest.fn()}
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
                isCustomMetadata
                isEditable
                onCascadeModeChange={jest.fn()}
                onCascadeToggle={jest.fn()}
                shouldShowCascadeOptions
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should render AI folder extraction toggle when canEdit, canUseAIFolderExtraction, and shouldShowCascadeOptions are true', () => {
        render(<CascadePolicy canEdit canUseAIFolderExtraction shouldShowCascadeOptions />);
        expect(screen.getByText('Box AI Autofill')).toBeInTheDocument();
    });

    test.each([
        [false, false, false],
        [true, false, false],
        [false, true, false],
        [true, true, false],
    ])(
        'should not render AI folder extraction toggle when canEdit, canUseAIFolderExtraction, and shouldShowCascadeOptions are %s, %s, and %s',
        (canEdit, canUseAIFolderExtraction, shouldShowCascadeOptions) => {
            render(
                <CascadePolicy
                    canEdit={canEdit}
                    canUseAIFolderExtraction={canUseAIFolderExtraction}
                    shouldShowCascadeOptions={shouldShowCascadeOptions}
                />,
            );
            expect(screen.queryByText('Box AI Autofill')).not.toBeInTheDocument();
        },
    );
});
