import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import RedactWizardSidebar from '../RedactWizardSidebar';

// Mock the messages
const messages = {
    'be.sidebarRedactWizardTitle': 'Redaction Wizard',
};

const renderWithIntl = (component: React.ReactElement) => {
    return render(
        <IntlProvider messages={messages} locale="en">
            {component}
        </IntlProvider>
    );
};

describe('RedactWizardSidebar', () => {
    const defaultProps = {
        elementId: 'test-element',
        fileId: 'test-file-123',
    };

    test('should render loading state initially', () => {
        renderWithIntl(<RedactWizardSidebar {...defaultProps} />);
        
        expect(screen.getByText('Redaction Wizard')).toBeInTheDocument();
        expect(screen.getByText('Analyzing document for sensitive information...')).toBeInTheDocument();
    });

    test('should render detected items after loading', async () => {
        renderWithIntl(<RedactWizardSidebar {...defaultProps} />);
        
        // Wait for loading to complete
        await waitFor(() => {
            expect(screen.getByText('Detected Sensitive Information')).toBeInTheDocument();
        }, { timeout: 3000 });

        // Check that detected items are rendered
        expect(screen.getByText('Personal Name')).toBeInTheDocument();
        expect(screen.getByText('SSN')).toBeInTheDocument();
        expect(screen.getByText('Credit Card')).toBeInTheDocument();
        
        // Check that file info is displayed
        expect(screen.getByText('Sample Legal Document for Redaction Training.pdf')).toBeInTheDocument();
        expect(screen.getByText('Legal - DPA (EU/UK) Profile Active')).toBeInTheDocument();
    });

    test('should show correct risk levels and confidence', async () => {
        renderWithIntl(<RedactWizardSidebar {...defaultProps} />);
        
        await waitFor(() => {
            expect(screen.getByText('Detected Sensitive Information')).toBeInTheDocument();
        }, { timeout: 3000 });

        // Check risk level badges
        expect(screen.getByText('HIGH')).toBeInTheDocument();
        expect(screen.getByText('CRITICAL')).toBeInTheDocument();
        
        // Check confidence percentages
        expect(screen.getByText('Confidence: 95.0%')).toBeInTheDocument();
        expect(screen.getByText('Confidence: 99.0%')).toBeInTheDocument();
    });

    test('should show perform redaction button', async () => {
        renderWithIntl(<RedactWizardSidebar {...defaultProps} />);
        
        await waitFor(() => {
            expect(screen.getByText('Detected Sensitive Information')).toBeInTheDocument();
        }, { timeout: 3000 });

        expect(screen.getByText('Perform Redaction')).toBeInTheDocument();
    });

    test('should show summary information', async () => {
        renderWithIntl(<RedactWizardSidebar {...defaultProps} />);
        
        await waitFor(() => {
            expect(screen.getByText('Detected Sensitive Information')).toBeInTheDocument();
        }, { timeout: 3000 });

        // Check summary text
        expect(screen.getByText('0 fields selected for redaction')).toBeInTheDocument();
        expect(screen.getByText('7 fields pending validation')).toBeInTheDocument();
    });
}); 