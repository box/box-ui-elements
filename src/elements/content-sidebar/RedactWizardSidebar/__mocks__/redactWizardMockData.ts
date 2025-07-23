export interface DetectedItem {
    id: string;
    title: string;
    term: string;
    confidence: number;
    category: string;
    riskLevel: number;
}

export interface RedactionResponse {
    id: string;
    name: string;
    download_url?: string;
}

export interface FileInfo {
    name: string;
    profile?: string;
}

// Mock API functions - these would be replaced with actual API calls
export const mockFetchDetectedItems = async (fileId: string): Promise<DetectedItem[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return [
        {
            id: '1',
            title: 'Personal Name',
            term: 'Jennifer Marie Thompson',
            confidence: 95.0,
            category: 'PII',
            riskLevel: 2, // HIGH
        },
        {
            id: '2',
            title: 'SSN',
            term: '555-67-8901',
            confidence: 99.0,
            category: 'PII',
            riskLevel: 3, // CRITICAL
        },
        {
            id: '3',
            title: 'Date of Birth',
            term: 'April 22, 1985',
            confidence: 92.0,
            category: 'PII',
            riskLevel: 2, // HIGH
        },
        {
            id: '4',
            title: 'Bank Account',
            term: '4567-8901-2345-6789',
            confidence: 96.0,
            category: 'Financial',
            riskLevel: 3, // CRITICAL
        },
        {
            id: '5',
            title: 'Routing Number',
            term: '121000358',
            confidence: 98.0,
            category: 'Financial',
            riskLevel: 3, // CRITICAL
        },
        {
            id: '6',
            title: 'Credit Card',
            term: '4532-1234-5678-9012',
            confidence: 99.0,
            category: 'Financial',
            riskLevel: 3, // CRITICAL
        },
        {
            id: '7',
            title: 'Settlement Amount',
            term: '$750,000',
            confidence: 91.0,
            category: 'Financial',
            riskLevel: 2, // HIGH
        },
    ];
};

export const mockPerformRedaction = async (fileId: string, selectedItemIds: string[]): Promise<RedactionResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
        id: 'redacted_file_123',
        name: 'Sample Legal Document for Redaction Training_redacted.pdf',
        download_url: 'https://api.box.com/2.0/files/redacted_file_123/content',
    };
};

export const mockGetFileInfo = async (fileId: string): Promise<FileInfo> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
        name: 'Sample Legal Document for Redaction Training.pdf',
        profile: 'Legal - DPA (EU/UK) Profile Active',
    };
}; 