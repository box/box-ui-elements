export interface DetectedItem {
    id: number,
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
            "id": 1,
            "category": "PII",
            "confidence": 100,
            "riskLevel": 3,
            "term": "123-45-6789",
            "title": "Social Security Number"
          },
          {
            "id": 2,
            "category": "PII",
            "confidence": 99,
            "riskLevel": 2,
            "term": "06/10/2005",
            "title": "Date of Birth"
          },
          {
            "id": 3,
            "category": "PII",
            "confidence": 96,
            "riskLevel": 1,
            "term": "SCR-001",
            "title": "Employee ID"
          },
          {
            "id": 4,
            "category": "PII",
            "confidence": 90,
            "riskLevel": 1,
            "term": "TM-404",
            "title": "Badge Number"
          },
          {
            "id": 5,
            "category": "PII",
            "confidence": 89,
            "riskLevel": 1,
            "term": "CL-999",
            "title": "License Number"
          },
          {
            "id": 6,
            "category": "PII",
            "confidence": 100,
            "riskLevel": 2,
            "term": "555-KANSAS",
            "title": "Phone Number"
          },
          {
            "id": 7,
            "category": "PII",
            "confidence": 99,
            "riskLevel": 2,
            "term": "555-RUBY-SHOE",
            "title": "Phone Number"
          },
          {
            "id": 8,
            "category": "card",
            "confidence": 92,
            "riskLevel": 3,
            "term": "987654321",
            "title": "Account Number"
          },
          {
            "id": 9,
            "category": "PII",
            "confidence": 97,
            "riskLevel": 2,
            "term": "123 Academic Lane, Research City, RC 12345",
            "title": "Address"
          },
          {
            "id": 10,
            "category": "PII",
            "confidence": 85,
            "riskLevel": 2,
            "term": "s.researcher@rubyslipper.org",
            "title": "Email Address"
          },
          {
            "id": 11,
            "category": "PII",
            "confidence": 100,
            "riskLevel": 1,
            "term": "555-RUBY-FAX",
            "title": "Fax Number"
          },
          {
            "id": 12,
            "category": "PII",
            "confidence": 83,
            "riskLevel": 1,
            "term": "Harold Lollipop",
            "title": "Real Name"
          },
          {
            "id": 13,
            "category": "PII",
            "confidence": 100,
            "riskLevel": 2,
            "term": "999 Dark Castle Road",
            "title": "Suspect Address"
          }
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