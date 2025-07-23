import React, { useState, useEffect } from 'react';

import { useIntl } from 'react-intl';

import Button, { ButtonType } from '../../../components/button/Button';
import PrimaryButton from '../../../components/primary-button/PrimaryButton';
import LoadingIndicator, { LoadingIndicatorSize } from '../../../components/loading-indicator/LoadingIndicator';
import { Notification } from '../../../components/notification';
import NotificationsWrapper from '../../../components/notification/NotificationsWrapper';
import Tooltip from '../../../components/tooltip/Tooltip';
import IconCheck from '../../../icons/general/IconCheck';
import IconClose from '../../../icons/general/IconClose';

import { SIDEBAR_VIEW_REDACT_WIZARD } from '../../../constants';
import SidebarContent from '../SidebarContent';
import messages from '../../common/messages';
import RedactWizardItemCard from './RedactWizardItemCard';
import { 
    type DetectedItem, 
    type FileInfo,
    mockFetchDetectedItems, 
    mockPerformRedaction, 
    mockGetFileInfo 
} from './__mocks__/redactWizardMockData';
import './RedactWizardSidebar.scss';

export interface RedactWizardSidebarProps {
    elementId: string;
    fileId: string;
    hasSidebarInitialized?: boolean;
    api?: any; // Mock API for testing
}

const RedactWizardSidebar = ({ elementId, fileId, api }: RedactWizardSidebarProps) => {
    const { formatMessage } = useIntl();
    
    const [isLoading, setIsLoading] = useState(true);
    const [isPerformingRedaction, setIsPerformingRedaction] = useState(false);
    const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [notifications, setNotifications] = useState<{ [key: string]: React.ReactElement }>({});
    const [notificationID, setNotificationID] = useState<number>(0);
    const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

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
                createNotification('error', 'Failed to load detected items');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [fileId]);

    // Close a notification
    const handleNotificationClose = (id: number) => {
        const updatedNotifications = { ...notifications };
        delete updatedNotifications[id];
        setNotifications(updatedNotifications);
    };

    // Create a notification
    const createNotification = (type: string, message: string) => {
        const updatedNotifications = { ...notifications };
        if (updatedNotifications[notificationID]) {
            return;
        }
        updatedNotifications[notificationID] = (
            <Notification
                key={notificationID}
                duration="short"
                onClose={() => handleNotificationClose(notificationID)}
                type={type as any}
            >
                <span>{message}</span>
            </Notification>
        );
        setNotifications(updatedNotifications);
        setNotificationID(notificationID + 1);
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
            createNotification('warn', 'Please select at least one item to redact');
            return;
        }

        try {
            setIsPerformingRedaction(true);
            const result = await mockPerformRedaction(fileId, Array.from(selectedItems));
            
            createNotification('info', `Redaction completed! New file: ${result.name}`);
            
            // Reset selections after successful redaction
            setSelectedItems(new Set());
            
        } catch (error) {
            console.error('Error performing redaction:', error);
            createNotification('error', 'Failed to perform redaction');
        } finally {
            setIsPerformingRedaction(false);
        }
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
        <>
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
                        {detectedItems.map(item => (
                            <RedactWizardItemCard
                                key={item.id}
                                item={item}
                                isSelected={selectedItems.has(item.id)}
                                onApprove={handleItemApprove}
                                onReject={handleItemReject}
                            />
                        ))}
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

            </div>
        </SidebarContent>
        <NotificationsWrapper>
            <>{[...Object.values(notifications)]}</>
        </NotificationsWrapper>
    </>
    );
};

export default RedactWizardSidebar;
