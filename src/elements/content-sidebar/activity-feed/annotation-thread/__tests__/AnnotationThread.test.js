// @flow
import { render } from '@testing-library/react';
import React from 'react';
import AnnotationThread from '../AnnotationThread';

describe('elements/content-sidebar/activity-feed/annotation-thread/AnnotationThread', () => {
    const getWrapper = (props = {}) => render(<AnnotationThread {...props} />);

    test('should not render if annotationId is undefined', async () => {
        const { container } = getWrapper();
        expect(container).toBeEmptyDOMElement();
    });

    test('should render properly', () => {
        const { getByTestId } = getWrapper({ annotationId: '1' });
        expect(getByTestId('annotation-thread')).toBeInTheDocument();
    });
});
