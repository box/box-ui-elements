import React, { useState, useEffect } from 'react';

import { useIntl } from 'react-intl';

import Button, { ButtonType } from '../../components/button/Button';
import PrimaryButton from '../../components/primary-button/PrimaryButton';
import LoadingIndicator, { LoadingIndicatorSize } from '../../components/loading-indicator/LoadingIndicator';
import { Notification } from '../../components/notification';
import Tooltip from '../../components/tooltip/Tooltip';
import IconCheck from '../../icons/general/IconCheck';
import IconClose from '../../icons/general/IconClose';

import { SIDEBAR_VIEW_REDACT_WIZARD } from '../../constants';
import SidebarContent from './SidebarContent';
import messages from '../common/messages';
import './RedactWizardSidebar.scss';

export interface RedactWizardSidebarProps {
    elementId: string;
    fileId: string;
    hasSidebarInitialized?: boolean;
    api?: any; // Mock API for testing
}

interface DetectedItem {
    id: string;
    title: string;
    term: string;
    confidence: number;
    category: string;
    riskLevel: number;
}

interface RedactionResponse {
    id: string;
    name: string;
    download_url?: string;
}

const RedactWizardSidebar = ({ elementId, fileId, api }: RedactWizardSidebarProps) => {
    const { formatMessage } = useIntl();
    
    const [isLoading, setIsLoading] = useState(true);
    const [isPerformingRedaction, setIsPerformingRedaction] = useState(false);
    const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [notifications, setNotifications] = useState<Array<{ id: string; type: string; message: string }>>([]);
    const [fileInfo, setFileInfo] = useState<{ name: string; profile?: string } | null>(null);

    // Mock API functions - these would be replaced with actual API calls
    const mockFetchDetectedItems = async (fileId: string): Promise<DetectedItem[]> => {
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

    const mockPerformRedaction = async (fileId: string, selectedItemIds: string[]): Promise<RedactionResponse> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return {
            id: 'redacted_file_123',
            name: 'Sample Legal Document for Redaction Training_redacted.pdf',
            download_url: 'https://api.box.com/2.0/files/redacted_file_123/content',
        };
    };

    const mockGetFileInfo = async (fileId: string): Promise<{ name: string; profile?: string }> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
            name: 'Sample Legal Document for Redaction Training.pdf',
            profile: 'Legal - DPA (EU/UK) Profile Active',
        };
    };

    // Fetch detected items on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [items, fileData] = await Promise.all([
                    mockFetchDetectedItems(fileId),
                    mockGetFileInfo(fileId),
                ]);
                setDetectedItems(items);
                setFileInfo(fileData);
            } catch (error) {
                console.error('Error fetching detected items:', error);
                addNotification('error', 'Failed to load detected items');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [fileId]);

    const addNotification = (type: string, message: string) => {
        const id = Date.now().toString();
        setNotifications(prev => [...prev, { id, type, message }]);
        
        // Auto-remove notification after 5 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };

    const handleItemApprove = (itemId: string) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            newSet.add(itemId);
            return newSet;
        });
    };

    const handleItemReject = (itemId: string) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(itemId);
            return newSet;
        });
    };

    const handlePerformRedaction = async () => {
        if (selectedItems.size === 0) {
            addNotification('warn', 'Please select at least one item to redact');
            return;
        }

        try {
            setIsPerformingRedaction(true);
            const result = await mockPerformRedaction(fileId, Array.from(selectedItems));
            
            addNotification('info', `Redaction completed! New file: ${result.name}`);
            
            // Reset selections after successful redaction
            setSelectedItems(new Set());
            
        } catch (error) {
            console.error('Error performing redaction:', error);
            addNotification('error', 'Failed to perform redaction');
        } finally {
            setIsPerformingRedaction(false);
        }
    };

    const getRiskLevelLabel = (riskLevel: number): string => {
        switch (riskLevel) {
            case 1: return 'LOW';
            case 2: return 'HIGH';
            case 3: return 'CRITICAL';
            default: return 'MEDIUM';
        }
    };

    const getRiskLevelColor = (riskLevel: number): string => {
        switch (riskLevel) {
            case 1: return '#26C281'; // Green
            case 2: return '#F5A623'; // Orange
            case 3: return '#ED3757'; // Red
            default: return '#666666'; // Gray
        }
    };

    const getConfidenceColor = (confidence: number): string => {
        if (confidence >= 95) return '#26C281'; // Green
        if (confidence >= 90) return '#0061D5'; // Blue
        if (confidence >= 80) return '#F5A623'; // Yellow
        return '#ED3757'; // Red
    };

    if (isLoading) {
        return (
            <SidebarContent
                className={'bcs-RedactWizardSidebar'}
                elementId={elementId}
                sidebarView={SIDEBAR_VIEW_REDACT_WIZARD}
                title={formatMessage(messages.sidebarRedactWizardTitle)}
            >
                <div className="bcs-RedactWizardSidebar-content">
                    <div className="bcs-RedactWizardSidebar-loading">
                        <LoadingIndicator size={LoadingIndicatorSize.LARGE} />
                        <p>Analyzing document for sensitive information...</p>
                    </div>
                </div>
            </SidebarContent>
        );
    }

    return (
        <SidebarContent
            className={'bcs-RedactWizardSidebar'}
            elementId={elementId}
            sidebarView={SIDEBAR_VIEW_REDACT_WIZARD}
            title={formatMessage(messages.sidebarRedactWizardTitle)}
        >
            <div className="bcs-RedactWizardSidebar-content">

                {/* Detected Information Section */}
                <div className="bcs-RedactWizardSidebar-section">
                    <h3>Detected Sensitive Information</h3>
                    <p className="bcs-RedactWizardSidebar-instructions">
                        Review and validate the information Box AI has identified for redaction. 
                        Click the check or X to confirm or reject each field.
                    </p>
                    
                    <div className="bcs-RedactWizardSidebar-validation-header">
                        <h4>Validation Required</h4>
                        <div className="bcs-RedactWizardSidebar-validation-actions">
                            <Tooltip text="Reject All">
                                <Button
                                    className="bcs-RedactWizardSidebar-reject-all-btn"
                                    onClick={() => setSelectedItems(new Set())}
                                    type={ButtonType.BUTTON}
                                >
                                    <IconClose color="#ED3757" width={16} height={16} />
                                </Button>
                            </Tooltip>
                            <Tooltip text="Approve All">
                                <Button
                                    className="bcs-RedactWizardSidebar-approve-all-btn"
                                    onClick={() => setSelectedItems(new Set(detectedItems.map(item => item.id)))}
                                    type={ButtonType.BUTTON}
                                >
                                    <IconCheck color="#26C281" width={16} height={16} />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                    
                    <div className="bcs-RedactWizardSidebar-items">
                        {detectedItems.map(item => {
                            const isSelected = selectedItems.has(item.id);
                            const riskLabel = getRiskLevelLabel(item.riskLevel);
                            const riskColor = getRiskLevelColor(item.riskLevel);
                            const confidenceColor = getConfidenceColor(item.confidence);
                            
                            return (
                                <div key={item.id} className="bcs-RedactWizardSidebar-item">
                                    <div className="bcs-RedactWizardSidebar-item-header">
                                        <span className="bcs-RedactWizardSidebar-item-title">{item.title}</span>
                                        <span 
                                            className="bcs-RedactWizardSidebar-item-risk"
                                            style={{ backgroundColor: riskColor }}
                                        >
                                            {riskLabel}
                                        </span>
                                    </div>
                                    
                                    <div className="bcs-RedactWizardSidebar-item-category">
                                        Category: {item.category}
                                    </div>
                                    
                                    <div className="bcs-RedactWizardSidebar-item-value">
                                        "{item.term}"
                                    </div>
                                    
                                    <div className="bcs-RedactWizardSidebar-item-footer">
                                        <span 
                                            className="bcs-RedactWizardSidebar-item-confidence"
                                            style={{ color: confidenceColor }}
                                        >
                                            Confidence: {item.confidence.toFixed(1)}%
                                        </span>
                                        
                                        <div className="bcs-RedactWizardSidebar-item-actions">
                                            <Button
                                                className={`bcs-RedactWizardSidebar-action-btn ${!isSelected ? 'is-active' : ''}`}
                                                onClick={() => handleItemReject(item.id)}
                                                type={ButtonType.BUTTON}
                                            >
                                                <IconClose color="#ED3757" width={16} height={16} />
                                            </Button>
                                            <Button
                                                className={`bcs-RedactWizardSidebar-action-btn ${isSelected ? 'is-active' : ''}`}
                                                onClick={() => handleItemApprove(item.id)}
                                                type={ButtonType.BUTTON}
                                            >
                                                <IconCheck color="#26C281" width={16} height={16} />
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    <div className="bcs-RedactWizardSidebar-item-status">
                                        {isSelected ? (
                                            <>
                                                <IconCheck color="#26C281" width={16} height={16} />
                                                <span style={{ color: '#26C281' }}>Will be redacted</span>
                                            </>
                                        ) : (
                                            <>
                                                <IconClose color="#ED3757" width={16} height={16} />
                                                <span style={{ color: '#ED3757' }}>Will not be redacted</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="bcs-RedactWizardSidebar-footer">
                    <div className="bcs-RedactWizardSidebar-summary">
                        <span>{selectedItems.size} fields selected for redaction</span>
                        <span className="bcs-RedactWizardSidebar-pending">
                            {detectedItems.length - selectedItems.size} fields pending validation
                        </span>
                    </div>
                    
                    <PrimaryButton
                        className="bcs-RedactWizardSidebar-perform-btn"
                        onClick={handlePerformRedaction}
                        isLoading={isPerformingRedaction}
                        type={ButtonType.BUTTON}
                    >
                        {isPerformingRedaction ? 'Performing Redaction...' : 'Perform Redaction'}
                    </PrimaryButton>
                </div>

                {/* Notifications */}
                {notifications.map(notification => (
                    <Notification
                        key={notification.id}
                        type={notification.type as any}
                        onClose={() => {
                            setNotifications(prev => prev.filter(n => n.id !== notification.id));
                        }}
                    >
                        <span>{notification.message}</span>
                    </Notification>
                ))}
            </div>
        </SidebarContent>
    );
};

export default RedactWizardSidebar;
