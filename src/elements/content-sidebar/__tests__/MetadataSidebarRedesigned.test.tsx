import React from 'react';
import { screen } from '@testing-library/react';
import MetadataSidebarRedesign from '../MetadataSidebarRedesign';
import { FIELD_PERMISSIONS_CAN_UPLOAD } from '../../../constants';
import { render } from '../../../test-utils/testing-library';

jest.unmock('react-intl');
jest.unmock('lodash');

jest.mock('../../common/api-context', () => Component => {
    return Component;
});
jest.mock('../../common/logger', () => ({
    withLogger: jest.fn(() => Component => Component),
}));
jest.mock('../../common/error-boundary', () => ({
    withErrorBoundary: jest.fn(() => Component => Component),
}));

jest.mock('lodash/flow', () => {
    return () => component => {
        return component;
    };
});

const mockAPI = {
    getFile: jest.fn((id, successCallback) => {
        successCallback({ id, [FIELD_PERMISSIONS_CAN_UPLOAD]: true });
    }),
    getMetadata: jest.fn((file, successCallback) => {
        successCallback({ editors: [], templates: [] });
    }),
};
const api = {
    getFileAPI: jest.fn().mockReturnValue(mockAPI),
    getMetadataAPI: jest.fn().mockReturnValue(mockAPI),
};

describe('elements/content-sidebar/Metadata/MetadataSidebarRedesigned', () => {
    const renderComponent = (props = {}) => {
        render(<MetadataSidebarRedesign {...props} />);
    };

    test('should render title', () => {
        renderComponent({ api });
        expect(screen.getByRole('heading', { level: 3, name: 'Metadata' })).toBeInTheDocument();
    });

    test('should call fetch file', () => {
        renderComponent({ api });
        expect(api.getFileAPI).toHaveBeenCalled();
    });

    test('should correctly render empty state when AI feature is enabled', () => {
        const isBoxAiSuggestionsFeatureEnabled = true;

        renderComponent({ api, isBoxAiSuggestionsFeatureEnabled });
        expect(screen.getByRole('heading', { level: 2, name: 'Autofill Metadata with Box AI' })).toBeInTheDocument();
        expect(
            screen.getByText(
                'Use the power of Box AI to quickly capture document metadata, with ever-increasing accuracy.',
            ),
        ).toBeInTheDocument();
    });

    test('should correctly render empty state when AI feature is disabled', () => {
        const isBoxAiSuggestionsFeatureEnabled = false;

        renderComponent({ api, isBoxAiSuggestionsFeatureEnabled });
        expect(screen.getByRole('heading', { level: 2, name: 'Add Metadata Templates' })).toBeInTheDocument();
        expect(
            screen.getByText('Add Metadata to your file to support business operations, workflows, and more!'),
        ).toBeInTheDocument();
    });
});
